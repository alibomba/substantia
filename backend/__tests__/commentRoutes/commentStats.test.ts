import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockDoesCommentExist, mockFindUserByEmail, mockGetCommentStats, mockIsCommentLiked, mockIsCommentedPostMine, mockIsSubscribedToCommentedPostOwner, mockPayload, mockUser, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('GET /comment-stats/:id', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('GET', '/api/comment-stats/123');
    });

    describe('comment does not exist', () => {
        it('returns 404 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .get('/api/comment-stats/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(404);
            expect(body.message).toBe('Komentarz nie istnieje');
        });
    });

    describe('user is not subscribed to the profile', () => {
        it('returns 403 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(true);
            mockIsSubscribedToCommentedPostOwner.mockResolvedValueOnce(false);
            mockIsCommentedPostMine.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .get('/api/comment-stats/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(403);
            expect(body.message).toBe('Nie subskrybujesz tego profilu');
        });
    });

    describe('user is not subscribed to the profile but owns it', () => {
        it('does not return 403 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(true);
            mockIsSubscribedToCommentedPostOwner.mockResolvedValueOnce(false);
            mockIsCommentedPostMine.mockResolvedValueOnce(true);

            const { statusCode } = await supertest(app)
                .get('/api/comment-stats/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).not.toBe(403);
        });
    });

    describe('comment exists', () => {
        it('calls isLiked and getCommentStats methods with correct arguments', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(true);
            mockIsSubscribedToCommentedPostOwner.mockResolvedValueOnce(true);
            mockIsCommentedPostMine.mockResolvedValueOnce(false);

            await supertest(app)
                .get('/api/comment-stats/123')
                .set('Authorization', 'Bearer token');

            expect(mockGetCommentStats).toHaveBeenCalledWith('123');
            expect(mockIsCommentLiked).toHaveBeenCalledWith('123', '123');
        });

        it('returns 200 status and correct data', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(true);
            mockIsSubscribedToCommentedPostOwner.mockResolvedValueOnce(true);
            mockIsCommentedPostMine.mockResolvedValueOnce(false);
            mockGetCommentStats.mockResolvedValueOnce({ likes: 20, replies: 3 });
            mockIsCommentLiked.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .get('/api/comment-stats/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(200);
            expect(body).toEqual({ stats: { likes: 20, replies: 3 }, isLiked: false });
        });
    });
});