import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockCreateChannel, mockCreateStripeProduct, mockFindUserByEmail, mockGenerateUniqueId, mockPayload, mockPostAzureObject, mockUser, mockValidateBannerAspectRatio, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('POST /create-channel', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('POST', '/api/create-channel');
    });

    describe('invalid data given', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValue(mockPayload);
            mockFindUserByEmail.mockResolvedValue(mockUser);
            const invalidData = [
                await supertest(app)
                    .post('/api/create-channel')
                    .field('description', '')
                    .field('subscriptionPrice', '12.99')
                    .attach('banner', `${__dirname}/../mockFiles/correct-banner.png`)
                    .attach('profileVideo', `${__dirname}/../mockFiles/6MBvideo.mp4`)
                    .set('Authorization', 'Bearer token')
                    .set('Content-Type', 'multipart/form-data'),
                await supertest(app)
                    .post('/api/create-channel')
                    .field('description', 'x'.repeat(201))
                    .field('subscriptionPrice', '12.99')
                    .attach('banner', `${__dirname}/../mockFiles/correct-banner.png`)
                    .attach('profileVideo', `${__dirname}/../mockFiles/6MBvideo.mp4`)
                    .set('Authorization', 'Bearer token')
                    .set('Content-Type', 'multipart/form-data'),
                await supertest(app)
                    .post('/api/create-channel')
                    .field('description', 'test description')
                    .field('subscriptionPrice', 'bad price')
                    .attach('banner', `${__dirname}/../mockFiles/correct-banner.png`)
                    .attach('profileVideo', `${__dirname}/../mockFiles/6MBvideo.mp4`)
                    .set('Authorization', 'Bearer token')
                    .set('Content-Type', 'multipart/form-data'),
                await supertest(app)
                    .post('/api/create-channel')
                    .field('description', 'test description')
                    .field('subscriptionPrice', '201')
                    .attach('banner', `${__dirname}/../mockFiles/correct-banner.png`)
                    .attach('profileVideo', `${__dirname}/../mockFiles/6MBvideo.mp4`)
                    .set('Authorization', 'Bearer token')
                    .set('Content-Type', 'multipart/form-data'),
                await supertest(app)
                    .post('/api/create-channel')
                    .field('description', 'test description')
                    .field('subscriptionPrice', '12.99')
                    .attach('banner', '')
                    .attach('profileVideo', `${__dirname}/../mockFiles/6MBvideo.mp4`)
                    .set('Authorization', 'Bearer token')
                    .set('Content-Type', 'multipart/form-data'),
                await supertest(app)
                    .post('/api/create-channel')
                    .field('description', 'test description')
                    .field('subscriptionPrice', '12.99')
                    .attach('banner', `${__dirname}/../mockFiles/correct-banner.png`)
                    .attach('profileVideo', '')
                    .set('Authorization', 'Bearer token')
                    .set('Content-Type', 'multipart/form-data')
            ];

            await Promise.all(invalidData.map(async data => {
                expect(data.statusCode).toBe(422);
                expect(data.body.message).toEqual(expect.any(String));
            }));
        });
    });

    describe('invalid banner aspect ratio', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockValidateBannerAspectRatio.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .post('/api/create-channel')
                .field('description', 'test description')
                .field('subscriptionPrice', '12.99')
                .attach('banner', `${__dirname}/../mockFiles/correct-banner.png`)
                .attach('profileVideo', `${__dirname}/../mockFiles/6MBvideo.mp4`)
                .set('Authorization', 'Bearer token')
                .set('Content-Type', 'multipart/form-data');

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Banner musi mieć współczynnik proporcji 5:1');
        });
    });

    describe('correct data given', () => {
        it('posts profile video and banner to the azure blob storage', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockValidateBannerAspectRatio.mockResolvedValueOnce(true);
            mockGenerateUniqueId.mockReturnValue('uuid');
            mockPostAzureObject.mockResolvedValue(expect.any(Object));

            await supertest(app)
                .post('/api/create-channel')
                .field('description', 'test description')
                .field('subscriptionPrice', '12.99')
                .attach('banner', `${__dirname}/../mockFiles/correct-banner.png`)
                .attach('profileVideo', `${__dirname}/../mockFiles/6MBvideo.mp4`)
                .set('Authorization', 'Bearer token')
                .set('Content-Type', 'multipart/form-data');

            expect(mockPostAzureObject).toHaveBeenNthCalledWith(1, expect.any(Buffer), 'banners/uuid', expect.any(String));
            expect(mockPostAzureObject).toHaveBeenNthCalledWith(2, expect.any(Buffer), 'profileVideos/uuid', expect.any(String))
        });

        it('creates the stripe product', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockValidateBannerAspectRatio.mockResolvedValueOnce(true);
            mockGenerateUniqueId.mockReturnValue('uuid');
            mockPostAzureObject.mockResolvedValue(expect.any(Object));

            await supertest(app)
                .post('/api/create-channel')
                .field('description', 'test description')
                .field('subscriptionPrice', '12.99')
                .attach('banner', `${__dirname}/../mockFiles/correct-banner.png`)
                .attach('profileVideo', `${__dirname}/../mockFiles/6MBvideo.mp4`)
                .set('Authorization', 'Bearer token')
                .set('Content-Type', 'multipart/form-data');

            expect(mockCreateStripeProduct).toHaveBeenCalledWith(1299, mockPayload.id);
        });

        it('updates the user in DB and returns 204 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockValidateBannerAspectRatio.mockResolvedValueOnce(true);
            mockGenerateUniqueId.mockReturnValue('uuid');
            mockPostAzureObject.mockResolvedValue(expect.any(Object));
            mockCreateStripeProduct.mockResolvedValueOnce('productID');

            const { statusCode } = await supertest(app)
                .post('/api/create-channel')
                .field('description', 'test description')
                .field('subscriptionPrice', '12.99')
                .attach('banner', `${__dirname}/../mockFiles/correct-banner.png`)
                .attach('profileVideo', `${__dirname}/../mockFiles/6MBvideo.mp4`)
                .set('Authorization', 'Bearer token')
                .set('Content-Type', 'multipart/form-data');

            expect(mockCreateChannel).toHaveBeenCalledWith(mockPayload.id, 'uuid', 'uuid', 'test description', 'productID', 1299);
            expect(statusCode).toBe(204);
        });
    });
});