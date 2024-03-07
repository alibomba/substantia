import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockFindUserByEmail, mockGetUserBookmarks, mockPayload, mockUser, mockVerifyToken, mockViewablePost } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('GET /my-bookmarks', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('GET', '/api/my-bookmarks');
    });

    describe('user has no bookmarks', () => {
        it('returns 200 status and an empty array', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserBookmarks.mockResolvedValueOnce([]);

            const { statusCode, body } = await supertest(app)
                .get('/api/my-bookmarks')
                .set('Authorization', 'Bearer token');

            expect(mockGetUserBookmarks).toHaveBeenCalledWith('123');
            expect(statusCode).toBe(200);
            expect(body).toEqual([]);
        });
    });

    describe('user has bookmarks', () => {
        it('returns 200 status and an array of bookmarked posts', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserBookmarks.mockResolvedValueOnce([mockViewablePost, mockViewablePost]);

            const { statusCode, body } = await supertest(app)
                .get('/api/my-bookmarks')
                .set('Authorization', 'Bearer token');

            const mockExpectedPost = { ...mockViewablePost, createdAt: expect.any(String) };

            expect(statusCode).toBe(200);
            expect(body).toEqual([mockExpectedPost, mockExpectedPost]);
        });
    });
});