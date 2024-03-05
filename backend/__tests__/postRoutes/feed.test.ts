import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockFindUserByEmail, mockGetUserCustomerID, mockGetUserFeed, mockPayload, mockUser, mockVerifyToken, mockViewablePost } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('GET /feed', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('GET', '/api/feed');
    });

    describe('user has no customer id', () => {
        it('returns 200 status and correct data', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserCustomerID.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .get('/api/feed')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(200);
            expect(body).toEqual({ currentPage: 0, lastPage: 0, data: [] });
        });
    });

    describe('no page is specified', () => {
        it('calls getUserFeed with a default page which is one', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');

            await supertest(app)
                .get('/api/feed')
                .set('Authorization', 'Bearer token');

            expect(mockGetUserFeed).toHaveBeenCalledWith('customerID', 1);
        });
    });

    describe('page is specified', () => {
        it('calls getUserFeed with a specified page', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');

            await supertest(app)
                .get('/api/feed?page=4')
                .set('Authorization', 'Bearer token');

            expect(mockGetUserFeed).toHaveBeenCalledWith('customerID', 4);
        });
    });

    describe('user has no posts to display', () => {
        it('returns 200 status and correct data', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockGetUserFeed.mockResolvedValueOnce({ currentPage: 0, lastPage: 0, data: [] });

            const { statusCode, body } = await supertest(app)
                .get('/api/feed')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(200);
            expect(body).toEqual({ currentPage: 0, lastPage: 0, data: [] });
        });
    });

    describe('user has exceed the last page', () => {
        it('returns 200 status and correct data', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockGetUserFeed.mockResolvedValueOnce({ currentPage: 3, lastPage: 3, data: [] });

            const { statusCode, body } = await supertest(app)
                .get('/api/feed?page=4')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(statusCode);
            expect(body).toEqual({ currentPage: 3, lastPage: 3, data: [] });
        });
    });

    describe('user has posts to display', () => {
        it('returns 200 status and correct data', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockGetUserFeed.mockResolvedValueOnce({ currentPage: 3, lastPage: 3, data: [mockViewablePost, mockViewablePost] });

            const { statusCode, body } = await supertest(app)
                .get('/api/feed?page=3')
                .set('Authorization', 'Bearer token');

            const expectedPost = { ...mockViewablePost, createdAt: expect.any(String) };

            expect(statusCode).toBe(200);
            expect(body).toEqual({ currentPage: 3, lastPage: 3, data: [expectedPost, expectedPost] });
        });
    });
});