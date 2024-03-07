import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockFindUserByEmail, mockGetPostStats, mockIsBookmarked, mockIsLiked, mockIsSubscribedToPostOwner, mockPayload, mockUser, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('GET /post-stats/:id', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('GET', '/api/post-stats/123');
    });

    describe('post does not exist', () => {
        it('returns 404 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetPostStats.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .get('/api/post-stats/123')
                .set('Authorization', 'Bearer token');

            expect(mockGetPostStats).toHaveBeenCalledWith('123');
            expect(statusCode).toBe(404);
            expect(body.message).toBe('Post nie istnieje');
        });
    });

    describe('user is not subscribed to the post owner', () => {
        it('returns 403 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetPostStats.mockResolvedValueOnce({ likes: 20, comments: 3 });
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .get('/api/post-stats/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(403);
            expect(body.message).toBe('Nie subskrybujesz tego profilu');
        });
    });

    describe('post exists', () => {
        it('calls isLiked and isBookmarked methods with correct arguments', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetPostStats.mockResolvedValueOnce({ likes: 20, comments: 3 });
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(true);

            await supertest(app)
                .get('/api/post-stats/123')
                .set('Authorization', 'Bearer token');

            expect(mockIsLiked).toHaveBeenCalledWith('123', '123');
            expect(mockIsBookmarked).toHaveBeenCalledWith('123', '123');
        });

        it('returns 200 status and correct data', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetPostStats.mockResolvedValueOnce({ likes: 20, comments: 3 });
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(true);
            mockIsLiked.mockResolvedValueOnce(true);
            mockIsBookmarked.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .get('/api/post-stats/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(200);
            expect(body).toEqual({
                stats: { likes: 20, comments: 3 },
                isLiked: true,
                isBookmarked: false
            });
        });
    });
});