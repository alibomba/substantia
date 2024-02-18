import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockFindUserByEmail, mockPayload, mockUser, mockVerifyToken } from "../mocks";
import jwtMiddlewareTest from "../jwtMiddlewareTest";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('GET /auth', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('GET', '/api/auth');
    });

    describe('valid token given', () => {
        it('returns 200 status and a payload', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            const { statusCode, body } = await supertest(app)
                .get('/api/auth')
                .set('Authorization', `Bearer token`);

            expect(statusCode).toBe(200);
            expect(body).toEqual(mockPayload);
        });
    });
});