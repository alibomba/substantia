import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockFindToken, mockPayload, mockRefreshToken, mockSignToken, mockVerifyToken } from "../mocks";

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

    describe('correct refresh token given', () => {
        it('signs new token with correct payload', async () => {
            mockFindToken.mockResolvedValueOnce(mockRefreshToken);
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockSignToken.mockResolvedValueOnce('newToken');
            await supertest(app)
                .post('/api/refresh')
                .send({ refreshToken: 'token' });

            expect(mockSignToken).toHaveBeenCalledWith(mockPayload, 'access');
        });

        it('returns 200 status and a new token', async () => {
            mockFindToken.mockResolvedValueOnce(mockRefreshToken);
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockSignToken.mockReturnValueOnce('newToken');
            const { statusCode, body } = await supertest(app)
                .post('/api/refresh')
                .send({ refreshToken: 'token' });

            expect(statusCode).toBe(200);
            expect(body.accessToken).toBe('newToken');
        });
    });
});