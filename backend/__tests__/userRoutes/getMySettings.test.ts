import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockFindUserByEmail, mockGetUserSettings, mockPayload, mockSettings, mockUser, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('GET /my-settings', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('GET', '/api/my-settings');
    });

    describe('settings are retrieved', () => {
        it('returns 200 status and the settings object', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserSettings.mockResolvedValueOnce(mockSettings);

            const { statusCode, body } = await supertest(app)
                .get('/api/my-settings')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(200);
            expect(body).toEqual(mockSettings);
        });
    });
});