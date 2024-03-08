import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockCreateReply, mockDoesCommentExist, mockFindUserByEmail, mockIsCommentedPostMine, mockIsSubscribedToCommentedPostOwner, mockPayload, mockUser, mockVerifyToken, mockViewableReply } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('POST /comment-replies/:id', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('POST', '/api/comment-replies/123');
    });

    describe('comment does not exist', () => {
        it('returns 404 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .post('/api/comment-replies/123')
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
                .post('/api/comment-replies/123')
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
                .post('/api/comment-replies/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).not.toBe(403);
        });
    });

    describe('no content given', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(true);
            mockIsSubscribedToCommentedPostOwner.mockResolvedValueOnce(true);
            mockIsCommentedPostMine.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .post('/api/comment-replies/123')
                .set('Authorization', 'Bearer token')
                .send({ content: '' });

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Treść odpowiedzi jest wymagana');
        });
    });

    describe('valid content given', () => {
        it('creates the reply with correct data', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(true);
            mockIsSubscribedToCommentedPostOwner.mockResolvedValueOnce(true);
            mockIsCommentedPostMine.mockResolvedValueOnce(false);

            await supertest(app)
                .post('/api/comment-replies/123')
                .set('Authorization', 'Bearer token')
                .send({ content: 'test comment reply content' });

            expect(mockCreateReply).toHaveBeenCalledWith('test comment reply content', '123', '123');
        });

        it('returns 201 status and the created reply', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesCommentExist.mockResolvedValueOnce(true);
            mockIsSubscribedToCommentedPostOwner.mockResolvedValueOnce(true);
            mockIsCommentedPostMine.mockResolvedValueOnce(false);
            mockCreateReply.mockResolvedValueOnce(mockViewableReply);

            const { statusCode, body } = await supertest(app)
                .post('/api/comment-replies/123')
                .set('Authorization', 'Bearer token')
                .send({ content: 'test comment reply content' });

            expect(statusCode).toBe(201);
            expect(body).toEqual({ ...mockViewableReply, createdAt: expect.any(String) });
        });
    });
});