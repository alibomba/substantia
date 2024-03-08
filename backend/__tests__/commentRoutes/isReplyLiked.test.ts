import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockDoesReplyExist, mockFindUserByEmail, mockIsRepliedPostMine, mockIsReplyLiked, mockIsSubscribedToRepliedPostOwner, mockPayload, mockUser, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('GET /is-reply-liked/:id', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('GET', '/api/is-reply-liked/123');
    });

    describe('reply does not exist', () => {
        it('returns 404 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesReplyExist.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .get('/api/is-reply-liked/123')
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
                .get('/api/is-reply-liked/123')
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
                .get('/api/is-reply-liked/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).not.toBe(403);
        });
    });

    describe('reply is liked', () => {
        it('calls the method with correct arguments', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesReplyExist.mockResolvedValueOnce(true);
            mockIsSubscribedToRepliedPostOwner.mockResolvedValueOnce(true);
            mockIsRepliedPostMine.mockResolvedValueOnce(false);
            mockIsReplyLiked.mockResolvedValueOnce(true);

            await supertest(app)
                .get('/api/is-reply-liked/123')
                .set('Authorization', 'Bearer token');

            expect(mockIsReplyLiked).toHaveBeenCalledWith('123', '123');
        });

        it('returns 200 status and true value', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesReplyExist.mockResolvedValueOnce(true);
            mockIsSubscribedToRepliedPostOwner.mockResolvedValueOnce(true);
            mockIsRepliedPostMine.mockResolvedValueOnce(false);
            mockIsReplyLiked.mockResolvedValueOnce(true);

            const { statusCode, body } = await supertest(app)
                .get('/api/is-reply-liked/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(200);
            expect(body.isLiked).toBe(true);
        });
    });

    describe('reply is not liked', () => {
        it('calls the method with correct arguments', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesReplyExist.mockResolvedValueOnce(true);
            mockIsSubscribedToRepliedPostOwner.mockResolvedValueOnce(true);
            mockIsRepliedPostMine.mockResolvedValueOnce(false);
            mockIsReplyLiked.mockResolvedValueOnce(false);

            await supertest(app)
                .get('/api/is-reply-liked/123')
                .set('Authorization', 'Bearer token');

            expect(mockIsReplyLiked).toHaveBeenCalledWith('123', '123');
        });

        it('returns 200 status and true value', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesReplyExist.mockResolvedValueOnce(true);
            mockIsSubscribedToRepliedPostOwner.mockResolvedValueOnce(true);
            mockIsRepliedPostMine.mockResolvedValueOnce(false);
            mockIsReplyLiked.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .get('/api/is-reply-liked/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(200);
            expect(body.isLiked).toBe(false);
        });
    });
});