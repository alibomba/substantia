import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockFindUserByEmail, mockHashPassword, mockPayload, mockUpdateSettings, mockUser, mockValidateSettings, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('PUT /update-settings', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('PUT', '/api/update-settings');
    });

    describe('invalid data given', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockValidateSettings.mockRejectedValueOnce(new Error('validation error', { cause: 'VALIDATION' }));

            const { statusCode, body } = await supertest(app)
                .put('/api/update-settings')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(422);
            expect(body.message).toBe('validation error');
        });
    });

    describe('no password was given', () => {
        it('updates the settings without a password', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockValidateSettings.mockImplementationOnce(async (req) => {
                return;
            });

            await supertest(app)
                .put('/api/update-settings')
                .set('Authorization', 'Bearer token');

            expect(mockUpdateSettings).toHaveBeenCalledWith('123', expect.any(Object), undefined);
        });

        it('returns 204 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockValidateSettings.mockImplementationOnce(async (req) => {
                return;
            });

            const { statusCode } = await supertest(app)
                .put('/api/update-settings')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(204);
        });
    });

    describe('password was given', () => {
        it('updates the settings with a password', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockValidateSettings.mockImplementationOnce(async (req) => {
                return;
            });
            mockHashPassword.mockResolvedValueOnce('hashedPassword');

            await supertest(app)
                .put('/api/update-settings')
                .send({ password: 'qwerty123' })
                .set('Authorization', 'Bearer token');

            expect(mockHashPassword).toHaveBeenCalledWith('qwerty123');
            expect(mockUpdateSettings).toHaveBeenCalledWith('123', expect.any(Object), 'hashedPassword');
        });

        it('returns 204 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockValidateSettings.mockImplementationOnce(async (req) => {
                return;
            });
            mockHashPassword.mockResolvedValueOnce('hashedPassword');

            const { statusCode } = await supertest(app)
                .put('/api/update-settings')
                .send({ password: 'qwerty123' })
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(204);
        });
    });
});