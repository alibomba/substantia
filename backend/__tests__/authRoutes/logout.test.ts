import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockDeleteToken, mockFindToken, mockFindUserByEmail, mockPayload, mockRefreshToken, mockUser, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('POST /logout', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('POST', '/api/logout');
    });

    describe('no refresh token given', () => {
        it('returns 401 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            const { statusCode, body } = await supertest(app)
                .post('/api/logout')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(401);
            expect(body.message).toEqual('Nie znaleziono tokena');
        });
    });

    describe('refresh token not found in db', () => {
        it('returns 401 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockFindToken.mockResolvedValueOnce(null);
            const { statusCode, body } = await supertest(app)
                .post('/api/logout')
                .set('Authorization', 'Bearer token')
                .send({ refreshToken: 'token' });

            expect(statusCode).toBe(401);
            expect(body.message).toEqual('Token nieprawidłowy');
        });
    });

    describe('incorrect refresh token given', () => {
        it('returns 401 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockFindToken.mockResolvedValueOnce(mockRefreshToken);
            mockVerifyToken.mockRejectedValueOnce({ message: 'jwt error' });
            const { statusCode, body } = await supertest(app)
                .post('/api/logout')
                .set('Authorization', 'Bearer token')
                .send({ refreshToken: 'token' });

            expect(statusCode).toBe(401);
            expect(body.message).toEqual('Token nieprawidłowy');
        });
    });

    describe('correct refresh token given', () => {
        it('deletes refresh token', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockFindToken.mockResolvedValueOnce(mockRefreshToken);
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            await supertest(app)
                .post('/api/logout')
                .set('Authorization', 'Bearer token')
                .send({ refreshToken: 'token' });

            expect(mockDeleteToken).toHaveBeenCalledWith('token');
        });

        it('returns 204 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockFindToken.mockResolvedValueOnce(mockRefreshToken);
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            const { statusCode } = await supertest(app)
                .post('/api/logout')
                .set('Authorization', 'Bearer token')
                .send({ refreshToken: 'token' });

            expect(statusCode).toBe(204);
        });
    });
});