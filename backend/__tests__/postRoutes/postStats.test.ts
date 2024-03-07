import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockFindUserByEmail, mockGetPostStats, mockIsBookmarked, mockIsLiked, mockIsPostMine, mockIsSubscribedToPostOwner, mockPayload, mockUser, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('GET /post-stats/:id', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('GET', '/api/post-stats/1234');
    });

    describe('post does not exist', () => {
        it('returns 404 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetPostStats.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .get('/api/post-stats/1234')
                .set('Authorization', 'Bearer token');

            expect(mockGetPostStats).toHaveBeenCalledWith('1234');
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
            mockIsPostMine.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .get('/api/post-stats/1234')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(403);
            expect(body.message).toBe('Nie subskrybujesz tego profilu');
        });
    });

    describe('user is not subscribed to the post owner but is the owner', () => {
        it('does not return 403 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetPostStats.mockResolvedValueOnce({ likes: 20, comments: 3 });
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(false);
            mockIsPostMine.mockResolvedValueOnce(true);

            const { statusCode } = await supertest(app)
                .get('/api/post-stats/1234')
                .set('Authorization', 'Bearer token');

            expect(statusCode).not.toBe(403);
        });
    });

    describe('post exists', () => {
        it('calls isLiked and isBookmarked methods with correct arguments', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetPostStats.mockResolvedValueOnce({ likes: 20, comments: 3 });
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(true);
            mockIsPostMine.mockResolvedValueOnce(false);

            await supertest(app)
                .get('/api/post-stats/1234')
                .set('Authorization', 'Bearer token');

            expect(mockIsLiked).toHaveBeenCalledWith('1234', '123');
            expect(mockIsBookmarked).toHaveBeenCalledWith('1234', '123');
        });

        it('returns 200 status and correct data', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetPostStats.mockResolvedValueOnce({ likes: 20, comments: 3 });
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(true);
            mockIsPostMine.mockResolvedValueOnce(false);
            mockIsLiked.mockResolvedValueOnce(true);
            mockIsBookmarked.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .get('/api/post-stats/1234')
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