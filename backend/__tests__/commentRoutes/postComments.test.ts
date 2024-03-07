import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockDoesPostExist, mockFindUserByEmail, mockGetPostComments, mockIsPostMine, mockIsSubscribedToPostOwner, mockPayload, mockUser, mockVerifyToken, mockViewableComment } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('GET /post-comments/:id', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('GET', '/api/post-comments/123');
    });

    describe('post does not exist', () => {
        it('returns 404 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesPostExist.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .get('/api/post-comments/123')
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

            const { statusCode, body } = await supertest(app)
                .get('/api/post-comments/123')
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
                .get('/api/post-comments/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).not.toBe(403);
        });
    });

    describe('page is not specified', () => {
        it('calls the comment getter method with correct arguments', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesPostExist.mockResolvedValueOnce(true);
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(true);
            mockIsPostMine.mockResolvedValueOnce(false);

            await supertest(app)
                .get('/api/post-comments/123')
                .set('Authorization', 'Bearer token');

            expect(mockGetPostComments).toHaveBeenCalledWith('123', 1);
        });
    });

    describe('page is specified', () => {
        it('calls the comment getter method with correct arguments', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesPostExist.mockResolvedValueOnce(true);
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(true);
            mockIsPostMine.mockResolvedValueOnce(false);
            mockGetPostComments.mockResolvedValueOnce({
                currentPage: 2,
                lastPage: 4,
                data: [mockViewableComment, mockViewableComment]
            });

            await supertest(app)
                .get('/api/post-comments/123?page=2')
                .set('Authorization', 'Bearer token');

            expect(mockGetPostComments).toHaveBeenCalledWith('123', 2);
        });

        it('returns 200 status and correct data', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockDoesPostExist.mockResolvedValueOnce(true);
            mockIsSubscribedToPostOwner.mockResolvedValueOnce(true);
            mockIsPostMine.mockResolvedValueOnce(false);
            mockGetPostComments.mockResolvedValueOnce({
                currentPage: 2,
                lastPage: 4,
                data: [mockViewableComment, mockViewableComment]
            });

            const { statusCode, body } = await supertest(app)
                .get('/api/post-comments/123?page=2')
                .set('Authorization', 'Bearer token');

            const expectedComment = { ...mockViewableComment, createdAt: expect.any(String) };

            expect(statusCode).toBe(200);
            expect(body).toEqual({
                currentPage: 2,
                lastPage: 4,
                data: [expectedComment, expectedComment]
            });
        });
    });
});