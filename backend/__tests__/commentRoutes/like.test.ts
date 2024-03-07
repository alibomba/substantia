import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockDoesCommentExist, mockFindUserByEmail, mockIsCommentedPostMine, mockIsSubscribedToCommentedPostOwner, mockPayload, mockToggleCommentLike, mockUser, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('POST /like-comment/:id', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('POST', '/api/like-comment/123');
    });

    describe('comment does not exist', () => {
        it('returns 404 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .post('/api/like-comment/123')
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
                .post('/api/like-comment/123')
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
                .post('/api/like-comment/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).not.toBe(403);
        });
    });

    describe('user has not liked the comment yet', () => {
        it('calls the toggle like method with correct arguments', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(true);
            mockIsSubscribedToCommentedPostOwner.mockResolvedValueOnce(true);
            mockIsCommentedPostMine.mockResolvedValueOnce(false);
            mockToggleCommentLike.mockResolvedValueOnce(true);

            await supertest(app)
                .post('/api/like-comment/123')
                .set('Authorization', 'Bearer token');

            expect(mockToggleCommentLike).toHaveBeenCalledWith('123', '123');
        });

        it('returns 201 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(true);
            mockIsSubscribedToCommentedPostOwner.mockResolvedValueOnce(true);
            mockIsCommentedPostMine.mockResolvedValueOnce(false);
            mockToggleCommentLike.mockResolvedValueOnce(true);

            const { statusCode } = await supertest(app)
                .post('/api/like-comment/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(201);
        });
    });

    describe('user has already liked the post', () => {
        it('calls the toggle like method with correct arguments', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(true);
            mockIsSubscribedToCommentedPostOwner.mockResolvedValueOnce(true);
            mockIsCommentedPostMine.mockResolvedValueOnce(false);
            mockToggleCommentLike.mockResolvedValueOnce(false);

            await supertest(app)
                .post('/api/like-comment/123')
                .set('Authorization', 'Bearer token');

            expect(mockToggleCommentLike).toHaveBeenCalledWith('123', '123');
        });

        it('returns 204 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(true);
            mockIsSubscribedToCommentedPostOwner.mockResolvedValueOnce(true);
            mockIsCommentedPostMine.mockResolvedValueOnce(false);
            mockToggleCommentLike.mockResolvedValueOnce(false);

            const { statusCode } = await supertest(app)
                .post('/api/like-comment/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(204);
        });
    });
});