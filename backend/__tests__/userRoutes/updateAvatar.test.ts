import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockFindUserByEmail, mockGenerateUniqueId, mockPayload, mockPostAzureObject, mockUpdateAvatar, mockUser, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('PUT /update-avatar', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('PUT', '/api/update-avatar');
    });

    describe('no avatar was given', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);

            const { statusCode, body } = await supertest(app)
                .put('/api/update-avatar')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Avatar jest wymagany');
        });
    });

    describe('avatar file is too big', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);

            const { statusCode, body } = await supertest(app)
                .put('/api/update-avatar')
                .attach('avatar', `${__dirname}/../mockFiles/7MBimage.jpg`)
                .set('Authorization', 'Bearer token')
                .set('Content-Type', 'multipart/form-data');

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Avatar może mieć maksymalnie 4MB');
        });
    });

    describe('correct avatar given', () => {
        it('posts the avatar to the azure blob storage', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGenerateUniqueId.mockReturnValueOnce('uuid');
            mockPostAzureObject.mockResolvedValueOnce(expect.any(Object));
            mockUpdateAvatar.mockResolvedValueOnce(expect.any(Object));

            await supertest(app)
                .put('/api/update-avatar')
                .attach('avatar', `${__dirname}/../mockFiles/3MBimage.jpg`)
                .set('Authorization', 'Bearer token');

            expect(mockPostAzureObject).toHaveBeenCalledWith(expect.any(Buffer), 'pfp/uuid', expect.any(String));
        });

        it('updates the avatar', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGenerateUniqueId.mockReturnValueOnce('uuid');
            mockPostAzureObject.mockResolvedValueOnce(expect.any(Object));
            mockUpdateAvatar.mockResolvedValueOnce(expect.any(Object));

            await supertest(app)
                .put('/api/update-avatar')
                .attach('avatar', `${__dirname}/../mockFiles/3MBimage.jpg`)
                .set('Authorization', 'Bearer token');

            expect(mockUpdateAvatar).toHaveBeenCalledWith('123', 'uuid');
        });

        it('returns 204 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGenerateUniqueId.mockReturnValueOnce('uuid');
            mockPostAzureObject.mockResolvedValueOnce(expect.any(Object));
            mockUpdateAvatar.mockResolvedValueOnce(expect.any(Object));

            const { statusCode } = await supertest(app)
                .put('/api/update-avatar')
                .attach('avatar', `${__dirname}/../mockFiles/3MBimage.jpg`)
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(204);
        });
    });
});