import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockFindUserByEmail, mockFindUserById, mockOAuthUser, mockPayload, mockUser, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('GET /check-oauth', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('GET', '/api/check-oauth');
    });

    describe('user has no oauth', () => {
        it('returns 200 status and false in response', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockFindUserById.mockResolvedValueOnce(mockUser);

            const { statusCode, body } = await supertest(app)
                .get('/api/check-oauth')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(200);
            expect(body.hasOAuth).toBe(false);
        });
    });

    describe('user has oauth', () => {
        it('returns 200 status and true in response', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockOAuthUser);
            mockFindUserById.mockResolvedValueOnce(mockOAuthUser);

            const { statusCode, body } = await supertest(app)
                .get('/api/check-oauth')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(200);
            expect(body.hasOAuth).toBe(true);
        });
    });
});