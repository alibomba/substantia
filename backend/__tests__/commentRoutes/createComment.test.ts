import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockCreateComment, mockDoesPostExist, mockFindUserByEmail, mockIsPostMine, mockIsSubscribedToPostOwner, mockPayload, mockUser, mockVerifyToken, mockViewableComment } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('POST /comments/:id', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('POST', '/api/comments/123');
    });

    describe('post does not exist', () => {
        it('returns 404 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesPostExist.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .post('/api/comments/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(404);
            expect(body.message).toBe('Post nie istnieje');
        });
    });

    describe('user is not subscribed to the profile', () => {
        it('returns 403 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesPostExist.mockResolvedValueOnce(true);
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(false);
            mockIsPostMine.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .post('/api/comments/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(403);
            expect(body.message).toBe('Nie subskrybujesz tego profilu');
        });
    });

    describe('user is not subscribed to the profile but owns it', () => {
        it('does not return 403 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesPostExist.mockResolvedValueOnce(true);
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(false);
            mockIsPostMine.mockResolvedValueOnce(true);

            const { statusCode } = await supertest(app)
                .post('/api/comments/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).not.toBe(403);
        });
    });

    describe('no content given', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesPostExist.mockResolvedValueOnce(true);
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(true);
            mockIsPostMine.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .post('/api/comments/123')
                .set('Authorization', 'Bearer token')
                .send({ content: '' });

            expect(statusCode).toBe(422);
            expect(body.message).toEqual('Treść komentarza jest wymagana');
        });
    });

    describe('valid content given', () => {
        it('creates the comment with correct data', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesPostExist.mockResolvedValueOnce(true);
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(true);
            mockIsPostMine.mockResolvedValueOnce(false);

            await supertest(app)
                .post('/api/comments/123')
                .set('Authorization', 'Bearer token')
                .send({ content: 'test comment content' });

            expect(mockCreateComment).toHaveBeenCalledWith('test comment content', '123', '123');
        });

        it('returns 201 status and the created comment', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesPostExist.mockResolvedValueOnce(true);
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(true);
            mockIsPostMine.mockResolvedValueOnce(false);
            mockCreateComment.mockResolvedValueOnce(mockViewableComment);

            const { statusCode, body } = await supertest(app)
                .post('/api/comments/123')
                .set('Authorization', 'Bearer token')
                .send({ content: 'test comment content' });

            expect(statusCode).toBe(201);
            expect(body).toEqual({ ...mockViewableComment, createdAt: expect.any(String) });
        });
    });
});