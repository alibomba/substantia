import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockDoesPostExist, mockFindUserByEmail, mockIsPostMine, mockIsSubscribedToPostOwner, mockPayload, mockTogglePostBookmark, mockUser, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('POST /bookmark-post/:id', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('POST', '/api/bookmark-post/1234');
    });

    describe('post does not exist', () => {
        it('returns 404 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesPostExist.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .post('/api/bookmark-post/1234')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(404);
            expect(body.message).toBe('Post nie istnieje');
        });
    });

    describe('user is not subscribed to the post owner', () => {
        it('returns 403 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesPostExist.mockResolvedValueOnce(true);
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(false);
            mockIsPostMine.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .post('/api/bookmark-post/1234')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(403);
            expect(body.message).toBe('Nie subskrybujesz tego profilu');
        });
    });

    describe('user is not subscribed to the post owner but is the owner', () => {
        it('does not return 403 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesPostExist.mockResolvedValueOnce(true);
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(false);
            mockIsPostMine.mockResolvedValueOnce(true);

            const { statusCode } = await supertest(app)
                .post('/api/bookmark-post/1234')
                .set('Authorization', 'Bearer token');

            expect(statusCode).not.toBe(403);
        });
    });

    describe('user has not bookmarked the post yet', () => {
        it('calls the toggle post bookmark method with correct arguments', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesPostExist.mockResolvedValueOnce(true);
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(true);
            mockIsPostMine.mockResolvedValueOnce(false);
            mockTogglePostBookmark.mockResolvedValueOnce(true);

            await supertest(app)
                .post('/api/bookmark-post/1234')
                .set('Authorization', 'Bearer token');

            expect(mockTogglePostBookmark).toHaveBeenCalledWith('1234', '123');
        });

        it('returns 201 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesPostExist.mockResolvedValueOnce(true);
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(true);
            mockIsPostMine.mockResolvedValueOnce(false);
            mockTogglePostBookmark.mockResolvedValueOnce(true);

            const { statusCode } = await supertest(app)
                .post('/api/bookmark-post/1234')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(201);
        });
    });

    describe('user has already bookmarked the post', () => {
        it('calls the toggle post bookmark method with correct arguments', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesPostExist.mockResolvedValueOnce(true);
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(true);
            mockIsPostMine.mockResolvedValueOnce(false);
            mockTogglePostBookmark.mockResolvedValueOnce(false);

            await supertest(app)
                .post('/api/bookmark-post/1234')
                .set('Authorization', 'Bearer token');

            expect(mockTogglePostBookmark).toHaveBeenCalledWith('1234', '123');
        });

        it('returns 204 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesPostExist.mockResolvedValueOnce(true);
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(true);
            mockIsPostMine.mockResolvedValueOnce(false);
            mockTogglePostBookmark.mockResolvedValueOnce(false);

            const { statusCode } = await supertest(app)
                .post('/api/bookmark-post/1234')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(204);
        });
    });
});