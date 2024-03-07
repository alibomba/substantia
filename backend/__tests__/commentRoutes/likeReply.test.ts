import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockDoesReplyExist, mockFindUserByEmail, mockIsRepliedPostMine, mockIsSubscribedToRepliedPostOwner, mockPayload, mockToggleReplyLike, mockUser, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('POST /like-reply/:id', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('POST', '/api/like-reply/123');
    });

    describe('reply does not exist', () => {
        it('returns 404 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesReplyExist.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .post('/api/like-reply/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(404);
            expect(body.message).toBe('Odpowiedź nie istnieje');
        });
    });

    describe('user is not subscribed to the profile', () => {
        it('returns 403 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesReplyExist.mockResolvedValueOnce(true);
            mockIsSubscribedToRepliedPostOwner.mockResolvedValueOnce(false);
            mockIsRepliedPostMine.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .post('/api/like-reply/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(403);
            expect(body.message).toBe('Nie subskrybujesz tego profilu');
        });
    });

    describe('user is not subscribed to the profile but owns it', () => {
        it('does not return 403 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesReplyExist.mockResolvedValueOnce(true);
            mockIsSubscribedToRepliedPostOwner.mockResolvedValueOnce(false);
            mockIsRepliedPostMine.mockResolvedValueOnce(true);

            const { statusCode } = await supertest(app)
                .post('/api/like-reply/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).not.toBe(403);
        });
    });

    describe('user has not liked the reply yet', () => {
        it('calls the toggle method with correct arguments', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesReplyExist.mockResolvedValueOnce(true);
            mockIsSubscribedToRepliedPostOwner.mockResolvedValueOnce(true);
            mockIsRepliedPostMine.mockResolvedValueOnce(false);
            mockToggleReplyLike.mockResolvedValueOnce(true);

            await supertest(app)
                .post('/api/like-reply/123')
                .set('Authorization', 'Bearer token');

            expect(mockToggleReplyLike).toHaveBeenCalledWith('123', '123');
        });

        it('returns 201 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesReplyExist.mockResolvedValueOnce(true);
            mockIsSubscribedToRepliedPostOwner.mockResolvedValueOnce(true);
            mockIsRepliedPostMine.mockResolvedValueOnce(false);
            mockToggleReplyLike.mockResolvedValueOnce(true);

            const { statusCode } = await supertest(app)
                .post('/api/like-reply/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(201);
        });
    });

    describe('user has already liked the reply', () => {
        it('calls the toggle method with correct arguments', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesReplyExist.mockResolvedValueOnce(true);
            mockIsSubscribedToRepliedPostOwner.mockResolvedValueOnce(true);
            mockIsRepliedPostMine.mockResolvedValueOnce(false);
            mockToggleReplyLike.mockResolvedValueOnce(false);

            await supertest(app)
                .post('/api/like-reply/123')
                .set('Authorization', 'Bearer token');

            expect(mockToggleReplyLike).toHaveBeenCalledWith('123', '123');
        });

        it('returns 204 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesReplyExist.mockResolvedValueOnce(true);
            mockIsSubscribedToRepliedPostOwner.mockResolvedValueOnce(true);
            mockIsRepliedPostMine.mockResolvedValueOnce(false);
            mockToggleReplyLike.mockResolvedValueOnce(false);

            const { statusCode } = await supertest(app)
                .post('/api/like-reply/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(204);
        });
    });
});