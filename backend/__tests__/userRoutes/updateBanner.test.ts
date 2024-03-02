import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockFindUserByEmail, mockGenerateUniqueId, mockGetUserPlanID, mockPayload, mockPostAzureObject, mockUpdateBanner, mockUser, mockValidateBannerAspectRatio, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('PUT /update-banner', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('PUT', '/api/update-banner');
    });

    describe('user has no channel', () => {
        it('returns 403 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .put('/api/update-banner')
                .set('Authorization', 'Bearer token');

            expect(mockGetUserPlanID).toHaveBeenCalledWith('123');
            expect(statusCode).toBe(403);
            expect(body.message).toBe('Nie posiadasz kanału');
        });
    });

    describe('no banner was given', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce('planID');

            const { statusCode, body } = await supertest(app)
                .put('/api/update-banner')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Banner jest wymagany');
        });
    });

    describe('banner has incorrect aspect ratio', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockValidateBannerAspectRatio.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .put('/api/update-banner')
                .attach('banner', `${__dirname}/../mockFiles/correct-banner.png`)
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Banner musi mieć współczynnik proporcji 5:1');
        });
    });

    describe('correct banner given', () => {
        it('posts the banner to the azure blob storage', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockValidateBannerAspectRatio.mockResolvedValueOnce(true);
            mockGenerateUniqueId.mockReturnValueOnce('uuid');
            mockPostAzureObject.mockResolvedValueOnce(expect.any(Object));
            mockUpdateBanner.mockResolvedValueOnce(expect.any(Object));

            await supertest(app)
                .put('/api/update-banner')
                .attach('banner', `${__dirname}/../mockFiles/correct-banner.png`)
                .set('Authorization', 'Bearer token');

            expect(mockPostAzureObject).toHaveBeenCalledWith(expect.any(Buffer), 'banners/uuid', expect.any(String));
        });

        it('updates the banner', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockValidateBannerAspectRatio.mockResolvedValueOnce(true);
            mockGenerateUniqueId.mockReturnValueOnce('uuid');
            mockPostAzureObject.mockResolvedValueOnce(expect.any(Object));
            mockUpdateBanner.mockResolvedValueOnce(expect.any(Object));

            await supertest(app)
                .put('/api/update-banner')
                .attach('banner', `${__dirname}/../mockFiles/correct-banner.png`)
                .set('Authorization', 'Bearer token');

            expect(mockUpdateBanner).toHaveBeenCalledWith('123', 'uuid');
        });

        it('returns 204 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockValidateBannerAspectRatio.mockResolvedValueOnce(true);
            mockGenerateUniqueId.mockReturnValueOnce('uuid');
            mockPostAzureObject.mockResolvedValueOnce(expect.any(Object));
            mockUpdateBanner.mockResolvedValueOnce(expect.any(Object));

            const { statusCode } = await supertest(app)
                .put('/api/update-banner')
                .attach('banner', `${__dirname}/../mockFiles/correct-banner.png`)
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(204);
        });
    });
});