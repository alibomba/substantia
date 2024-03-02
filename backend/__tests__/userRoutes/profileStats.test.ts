import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockGetProfileStats, mockGetUserPlanID, mockProfileSubscriptionCount } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('GET /profile-stats/:id', () => {
    describe('profile stats method returns null', () => {
        it('returns 404 status and a message', async () => {
            mockGetProfileStats.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .get('/api/profile-stats/123');

            expect(statusCode).toBe(404);
            expect(body.message).toBe('Użytkownik nie posiada kanału');
        });
    });

    describe('user plan id method returns null', () => {
        it('returns 404 status and a message', async () => {
            mockGetProfileStats.mockResolvedValueOnce({ posts: 10, likes: 2000 });
            mockGetUserPlanID.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .get('/api/profile-stats/123');

            expect(statusCode).toBe(404);
            expect(body.message).toBe('Użytkownik nie posiada kanału');
        });
    });

    describe('valid request', () => {
        it('gets correct profile stats', async () => {
            mockGetProfileStats.mockResolvedValueOnce({ posts: 10, likes: 2000 });
            mockGetUserPlanID.mockResolvedValueOnce('planID');

            await supertest(app)
                .get('/api/profile-stats/123');

            expect(mockGetProfileStats).toHaveBeenCalledWith('123');
        });

        it('gets correct planID', async () => {
            mockGetProfileStats.mockResolvedValueOnce({ posts: 10, likes: 2000 });
            mockGetUserPlanID.mockResolvedValueOnce('planID');

            await supertest(app)
                .get('/api/profile-stats/123');

            expect(mockGetUserPlanID).toHaveBeenCalledWith('123');
        });

        it('gets correct subscription count', async () => {
            mockGetProfileStats.mockResolvedValueOnce({ posts: 10, likes: 2000 });
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockProfileSubscriptionCount.mockResolvedValueOnce(12);

            await supertest(app)
                .get('/api/profile-stats/123');

            expect(mockProfileSubscriptionCount).toHaveBeenCalledWith('planID');
        });

        it('returns 200 status and a correct response object', async () => {
            mockGetProfileStats.mockResolvedValueOnce({ posts: 100, likes: 202100 });
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockProfileSubscriptionCount.mockResolvedValueOnce(1200);

            const { statusCode, body } = await supertest(app)
                .get('/api/profile-stats/123');

            expect(statusCode).toBe(200);
            expect(body).toEqual({ posts: '100', likes: '202.1k', subscriptions: '1.2k' });
        });
    });
});