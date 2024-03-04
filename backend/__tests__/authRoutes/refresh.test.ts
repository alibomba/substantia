import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockFindToken, mockFindUserById, mockGetAzureObject, mockPayload, mockRefreshToken, mockSignToken, mockUser, mockVerifyToken } from "../mocks";
import { MyJWTPayload } from "../../types";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('POST /register', () => {
    describe('no refresh token given', () => {
        it('returns 401 status and a message', async () => {
            const { statusCode, body } = await supertest(app)
                .post('/api/refresh');

            expect(statusCode).toBe(401);
            expect(body.message).toBe('Nie znaleziono tokena');
        });
    });

    describe('refresh token not found in db', () => {
        it('returns 401 status and a message', async () => {
            mockFindToken.mockResolvedValueOnce(null);
            const { statusCode, body } = await supertest(app)
                .post('/api/refresh')
                .send({ refreshToken: 'token' });

            expect(statusCode).toBe(401);
            expect(body.message).toBe('Token nieprawidłowy');
        });
    });

    describe('incorrect refresh token given', () => {
        it('returns 401 status and a message', async () => {
            mockFindToken.mockResolvedValueOnce(null);
            mockVerifyToken.mockRejectedValueOnce({ message: 'jwt error' });
            const { statusCode, body } = await supertest(app)
                .post('/api/refresh')
                .send({ refreshToken: 'token' });

            expect(statusCode).toBe(401);
            expect(body.message).toBe('Token nieprawidłowy');
        });
    });

    describe('user does not exist', () => {
        it('returns 401 status and a message', async () => {
            mockFindToken.mockResolvedValueOnce(mockRefreshToken);
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserById.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .post('/api/refresh')
                .send({ refreshToken: 'token' });

            expect(statusCode).toBe(401);
            expect(body.message).toBe('Użytkownik nie istnieje');
        });
    });

    describe('correct token given and user has no avatar', () => {
        it('signs a new token with correct payload', async () => {
            mockFindToken.mockResolvedValueOnce(mockRefreshToken);
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserById.mockResolvedValueOnce(mockUser);
            mockSignToken.mockReturnValueOnce('newToken');

            await supertest(app)
                .post('/api/refresh')
                .send({ refreshToken: 'token' });

            const payload: MyJWTPayload = {
                id: mockUser.id,
                email: mockUser.email,
                username: mockUser.username,
                slug: mockUser.slug,
                avatar: mockUser.avatar,
                hasChannel: mockUser.hasChannel
            }

            expect(mockSignToken).toHaveBeenCalledWith(payload, 'access');
        });

        it('returns 200 status and a new token', async () => {
            mockFindToken.mockResolvedValueOnce(mockRefreshToken);
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserById.mockResolvedValueOnce(mockUser);
            mockSignToken.mockReturnValueOnce('newToken');

            const { statusCode, body } = await supertest(app)
                .post('/api/refresh')
                .send({ refreshToken: 'token' });

            expect(statusCode).toBe(200);
            expect(body.accessToken).toBe('newToken');
        });
    });

    describe('correct token given and has an avatar', () => {
        it('gets the avatar from the azure blob storage', async () => {
            mockFindToken.mockResolvedValueOnce(mockRefreshToken);
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserById.mockResolvedValueOnce({ ...mockUser, avatar: 'uuid' });
            mockGetAzureObject.mockResolvedValueOnce('https://azure.com/pfp.jpg');
            mockSignToken.mockReturnValueOnce('newToken');

            await supertest(app)
                .post('/api/refresh')
                .send({ refreshToken: 'token' });

            expect(mockGetAzureObject).toHaveBeenCalledWith('pfp/uuid');
        });

        it('signs a new token with correct payload', async () => {
            mockFindToken.mockResolvedValueOnce(mockRefreshToken);
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserById.mockResolvedValueOnce({ ...mockUser, avatar: 'uuid' });
            mockGetAzureObject.mockResolvedValueOnce('https://azure.com/pfp.jpg');
            mockSignToken.mockReturnValueOnce('newToken');

            await supertest(app)
                .post('/api/refresh')
                .send({ refreshToken: 'token' });

            const payload: MyJWTPayload = {
                id: mockUser.id,
                email: mockUser.email,
                username: mockUser.username,
                slug: mockUser.slug,
                avatar: 'https://azure.com/pfp.jpg',
                hasChannel: mockUser.hasChannel
            }

            expect(mockSignToken).toHaveBeenCalledWith(payload, 'access');
        });

        it('returns 200 status and a new token', async () => {
            mockFindToken.mockResolvedValueOnce(mockRefreshToken);
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserById.mockResolvedValueOnce({ ...mockUser, avatar: 'uuid' });
            mockGetAzureObject.mockResolvedValueOnce('https://azure.com/pfp.jpg');
            mockSignToken.mockReturnValueOnce('newToken');

            const { statusCode, body } = await supertest(app)
                .post('/api/refresh')
                .send({ refreshToken: 'token' });

            expect(statusCode).toBe(200);
            expect(body.accessToken).toBe('newToken');
        });
    });
});