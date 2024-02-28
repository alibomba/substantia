import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockFindUserByEmail, mockGetAzureObject, mockGetProfilePreview, mockGetUserPlanID, mockIsSubscribed, mockPayload, mockUser, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('GET /profile-preview/:id', () => {
    describe('profile is not found or has no channel', () => {
        it('returns 404 status and a message', async () => {
            mockGetUserPlanID.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .get('/api/profile-preview/123');

            expect(mockGetUserPlanID).toHaveBeenCalledWith('123');
            expect(statusCode).toBe(404);
            expect(body.message).toBe('Użytkownik nie posiada kanału');
        });
    });

    describe('user is not logged in', () => {
        it('gets correct profile preview', async () => {
            mockGetUserPlanID.mockResolvedValueOnce('planID');

            await supertest(app)
                .get('/api/profile-preview/123');

            expect(mockGetProfilePreview).toHaveBeenCalledWith('123');
        });

        it('gets correct azure blob storage resources', async () => {
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockGetProfilePreview.mockResolvedValueOnce({
                id: '123',
                username: 'TestUser',
                slug: 'testuser',
                subscriptionPrice: 1299,
                avatar: 'pfp.jpg',
                banner: 'banner.jpg',
                profileVideo: 'profile-video.mp4',
                facebook: null,
                instagram: null,
                twitter: null,
                description: 'test profile description'
            });
            mockGetAzureObject.mockResolvedValueOnce('https://azure.com/banner.jpg')
                .mockResolvedValueOnce('https://azure.com/profile-video.mp4')
                .mockResolvedValueOnce('https://azure.com/pfp.jpg');

            await supertest(app)
                .get('/api/profile-preview/123');

            expect(mockGetAzureObject).toHaveBeenNthCalledWith(1, 'banners/banner.jpg');
            expect(mockGetAzureObject).toHaveBeenNthCalledWith(2, 'profileVideos/profile-video.mp4');
            expect(mockGetAzureObject).toHaveBeenNthCalledWith(3, 'pfp/pfp.jpg');
        });

        it('returns 200 status and correct data', async () => {
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockGetProfilePreview.mockResolvedValueOnce({
                id: '123',
                username: 'TestUser',
                slug: 'testuser',
                subscriptionPrice: 1299,
                avatar: 'pfp.jpg',
                banner: 'banner.jpg',
                profileVideo: 'profile-video.mp4',
                facebook: null,
                instagram: null,
                twitter: null,
                description: 'test profile description'
            });
            mockGetAzureObject.mockResolvedValueOnce('https://azure.com/banner.jpg')
                .mockResolvedValueOnce('https://azure.com/profile-video.mp4')
                .mockResolvedValueOnce('https://azure.com/pfp.jpg');

            const { statusCode, body } = await supertest(app)
                .get('/api/profile-preview/123');

            expect(statusCode).toBe(200);
            expect(body).toEqual({
                profile: {
                    id: '123',
                    username: 'TestUser',
                    slug: 'testuser',
                    subscriptionPrice: 1299,
                    avatar: 'https://azure.com/pfp.jpg',
                    banner: 'https://azure.com/banner.jpg',
                    profileVideo: 'https://azure.com/profile-video.mp4',
                    facebook: null,
                    instagram: null,
                    twitter: null,
                    description: 'test profile description'
                }, isSubscribed: false
            });
        });
    });

    describe('user is logged in but is not subscribed', () => {
        it('gets correct user from the db', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValue({ ...mockUser, stripeCustomerID: 'customerID' });
            mockGetUserPlanID.mockResolvedValueOnce('planID');

            await supertest(app)
                .get('/api/profile-preview/123')
                .set('Authorization', 'Bearer token');

            expect(mockFindUserByEmail).toHaveBeenNthCalledWith(2, mockPayload.email);
        });

        it('gets the correct profile', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValue({ ...mockUser, stripeCustomerID: 'customerID' });
            mockIsSubscribed.mockResolvedValueOnce(false);
            mockGetUserPlanID.mockResolvedValueOnce('planID');

            await supertest(app)
                .get('/api/profile-preview/123')
                .set('Authorization', 'Bearer token');

            expect(mockGetProfilePreview).toHaveBeenCalledWith('123');
        });

        it('gets correct azure blob storage resources', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValue({ ...mockUser, stripeCustomerID: 'customerID' });
            mockIsSubscribed.mockResolvedValueOnce(false);
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockGetProfilePreview.mockResolvedValueOnce({
                id: '123',
                username: 'TestUser',
                slug: 'testuser',
                subscriptionPrice: 1299,
                avatar: 'pfp.jpg',
                banner: 'banner.jpg',
                profileVideo: 'profile-video.mp4',
                facebook: null,
                instagram: null,
                twitter: null,
                description: 'test profile description'
            });
            mockGetAzureObject.mockResolvedValueOnce('https://azure.com/banner.jpg')
                .mockResolvedValueOnce('https://azure.com/profile-video.mp4')
                .mockResolvedValueOnce('https://azure.com/pfp.jpg');

            await supertest(app)
                .get('/api/profile-preview/123')
                .set('Authorization', 'Bearer token');

            expect(mockGetAzureObject).toHaveBeenNthCalledWith(1, 'banners/banner.jpg');
            expect(mockGetAzureObject).toHaveBeenNthCalledWith(2, 'profileVideos/profile-video.mp4');
            expect(mockGetAzureObject).toHaveBeenNthCalledWith(3, 'pfp/pfp.jpg');
        });

        it('returns 200 status and correct data', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValue({ ...mockUser, stripeCustomerID: 'customerID' });
            mockIsSubscribed.mockResolvedValueOnce(false);
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockGetProfilePreview.mockResolvedValueOnce({
                id: '123',
                username: 'TestUser',
                slug: 'testuser',
                subscriptionPrice: 1299,
                avatar: 'pfp.jpg',
                banner: 'banner.jpg',
                profileVideo: 'profile-video.mp4',
                facebook: null,
                instagram: null,
                twitter: null,
                description: 'test profile description'
            });
            mockGetAzureObject.mockResolvedValueOnce('https://azure.com/banner.jpg')
                .mockResolvedValueOnce('https://azure.com/profile-video.mp4')
                .mockResolvedValueOnce('https://azure.com/pfp.jpg');

            const { statusCode, body } = await supertest(app)
                .get('/api/profile-preview/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(200);
            expect(body).toEqual({
                profile: {
                    id: '123',
                    username: 'TestUser',
                    slug: 'testuser',
                    subscriptionPrice: 1299,
                    avatar: 'https://azure.com/pfp.jpg',
                    banner: 'https://azure.com/banner.jpg',
                    profileVideo: 'https://azure.com/profile-video.mp4',
                    facebook: null,
                    instagram: null,
                    twitter: null,
                    description: 'test profile description'
                }, isSubscribed: false
            });
        });
    });

    describe('user is logged in and subscribed', () => {
        it('gets correct user from the db', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValue({ ...mockUser, stripeCustomerID: 'customerID' });
            mockIsSubscribed.mockResolvedValueOnce(true);
            mockGetUserPlanID.mockResolvedValueOnce('planID');

            await supertest(app)
                .get('/api/profile-preview/123')
                .set('Authorization', 'Bearer token');

            expect(mockFindUserByEmail).toHaveBeenNthCalledWith(2, mockPayload.email);
        });

        it('gets the correct profile', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValue({ ...mockUser, stripeCustomerID: 'customerID' });
            mockIsSubscribed.mockResolvedValueOnce(true);
            mockGetUserPlanID.mockResolvedValueOnce('planID');

            await supertest(app)
                .get('/api/profile-preview/123')
                .set('Authorization', 'Bearer token');

            expect(mockGetProfilePreview).toHaveBeenCalledWith('123');
        });

        it('gets correct azure blob storage resources', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValue({ ...mockUser, stripeCustomerID: 'customerID' });
            mockIsSubscribed.mockResolvedValueOnce(true);
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockGetProfilePreview.mockResolvedValueOnce({
                id: '123',
                username: 'TestUser',
                slug: 'testuser',
                subscriptionPrice: 1299,
                avatar: 'pfp.jpg',
                banner: 'banner.jpg',
                profileVideo: 'profile-video.mp4',
                facebook: null,
                instagram: null,
                twitter: null,
                description: 'test profile description'
            });
            mockGetAzureObject.mockResolvedValueOnce('https://azure.com/banner.jpg')
                .mockResolvedValueOnce('https://azure.com/pfp.jpg');

            await supertest(app)
                .get('/api/profile-preview/123')
                .set('Authorization', 'Bearer token');

            expect(mockGetAzureObject).toHaveBeenNthCalledWith(1, 'banners/banner.jpg');
            expect(mockGetAzureObject).toHaveBeenNthCalledWith(2, 'pfp/pfp.jpg');
        });

        it('returns 200 status and correct data', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValue({ ...mockUser, stripeCustomerID: 'customerID' });
            mockIsSubscribed.mockResolvedValueOnce(true);
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockGetProfilePreview.mockResolvedValueOnce({
                id: '123',
                username: 'TestUser',
                slug: 'testuser',
                subscriptionPrice: 1299,
                avatar: 'pfp.jpg',
                banner: 'banner.jpg',
                profileVideo: 'profile-video.mp4',
                facebook: null,
                instagram: null,
                twitter: null,
                description: 'test profile description'
            });
            mockGetAzureObject.mockResolvedValueOnce('https://azure.com/banner.jpg')
                .mockResolvedValueOnce('https://azure.com/pfp.jpg');

            const { statusCode, body } = await supertest(app)
                .get('/api/profile-preview/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(200);
            expect(body).toEqual({
                profile: {
                    id: '123',
                    username: 'TestUser',
                    slug: 'testuser',
                    subscriptionPrice: 1299,
                    avatar: 'https://azure.com/pfp.jpg',
                    banner: 'https://azure.com/banner.jpg',
                    profileVideo: 'profile-video.mp4',
                    facebook: null,
                    instagram: null,
                    twitter: null,
                    description: 'test profile description'
                }, isSubscribed: true
            });
        });
    });
});