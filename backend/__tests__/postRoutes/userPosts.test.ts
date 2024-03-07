import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockFindUserByEmail, mockGetUserCustomerID, mockGetUserPlanID, mockGetUserPosts, mockIsSubscribed, mockPayload, mockUser, mockVerifyToken, mockViewablePost } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('GET /user-posts/:id', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('GET', '/api/user-posts/123');
    });

    describe('user has no customer id', () => {
        it('returns 403 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserCustomerID.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .get('/api/user-posts/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(403);
            expect(body.message).toBe('Nie subskrybujesz tego profilu');
        });
    });

    describe('profile does not exist', () => {
        it('returns 404 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockGetUserPlanID.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .get('/api/user-posts/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(404);
            expect(body.message).toBe('Profil nie istnieje');
        });
    });

    describe('user is not subscribed to the profile', () => {
        it('returns 403 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockIsSubscribed.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .get('/api/user-posts/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(403);
            expect(body.message).toBe('Nie subskrybujesz tego profilu');
        });
    });

    describe('no page is specified', () => {
        it('calls the post getter method with correct arguments', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockIsSubscribed.mockResolvedValueOnce(true);

            await supertest(app)
                .get('/api/user-posts/123')
                .set('Authorization', 'Bearer token');

            expect(mockGetUserPosts).toHaveBeenCalledWith('123', 1);
        });
    });

    describe('page is specified', () => {
        it('calls the post getter method with correct arguments', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockIsSubscribed.mockResolvedValueOnce(true);

            await supertest(app)
                .get('/api/user-posts/123?page=3')
                .set('Authorization', 'Bearer token');

            expect(mockGetUserPosts).toHaveBeenCalledWith('123', 3);
        });

        it('returns 200 status and correct data', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockIsSubscribed.mockResolvedValueOnce(true);
            mockGetUserPosts.mockResolvedValueOnce({
                currentPage: 2,
                lastPage: 4,
                data: [
                    mockViewablePost,
                    mockViewablePost
                ]
            });

            const { statusCode, body } = await supertest(app)
                .get('/api/user-posts/123?page=2')
                .set('Authorization', 'Bearer token');

            const expectedPost = { ...mockViewablePost, createdAt: expect.any(String) };

            expect(statusCode).toBe(200);
            expect(body).toEqual({
                currentPage: 2,
                lastPage: 4,
                data: [expectedPost, expectedPost]
            });
        });
    });
});