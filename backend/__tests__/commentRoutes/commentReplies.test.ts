import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockDoesCommentExist, mockFindUserByEmail, mockGetCommentReplies, mockIsCommentedPostMine, mockIsSubscribedToCommentedPostOwner, mockPayload, mockUser, mockVerifyToken, mockViewableReply } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('GET /comment-replies/:id', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('GET', '/api/comment-replies/123');
    });

    describe('comment does not exist', () => {
        it('returns 404 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .get('/api/comment-replies/123')
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
                .get('/api/comment-replies/123')
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
                .get('/api/comment-replies/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).not.toBe(403);
        });
    });

    describe('there are no replies', () => {
        it('it calls the getter method with correct arguments', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(true);
            mockIsSubscribedToCommentedPostOwner.mockResolvedValueOnce(true);
            mockIsCommentedPostMine.mockResolvedValueOnce(false);
            mockGetCommentReplies.mockResolvedValueOnce([]);

            await supertest(app)
                .get('/api/comment-replies/123')
                .set('Authorization', 'Bearer token');

            expect(mockGetCommentReplies).toHaveBeenCalledWith('123');
        });

        it('returns 200 status and an empty array', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(true);
            mockIsSubscribedToCommentedPostOwner.mockResolvedValueOnce(true);
            mockIsCommentedPostMine.mockResolvedValueOnce(false);
            mockGetCommentReplies.mockResolvedValueOnce([]);

            const { statusCode, body } = await supertest(app)
                .get('/api/comment-replies/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(200);
            expect(body).toEqual([]);
        });
    });

    describe('there are replies', () => {
        it('returns 200 status and an array of replies', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(true);
            mockIsSubscribedToCommentedPostOwner.mockResolvedValueOnce(true);
            mockIsCommentedPostMine.mockResolvedValueOnce(false);
            mockGetCommentReplies.mockResolvedValueOnce([mockViewableReply, mockViewableReply]);

            const { statusCode, body } = await supertest(app)
                .get('/api/comment-replies/123')
                .set('Authorization', 'Bearer token');

            const expectedReply = { ...mockViewableReply, createdAt: expect.any(String) };

            expect(statusCode).toBe(200);
            expect(body).toEqual([expectedReply, expectedReply]);
        });
    });
});