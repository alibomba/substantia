import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockFindUserByEmail, mockGetPostPollOption, mockGetUserCustomerID, mockGetUserPlanID, mockIsPollOptionMine, mockIsSubscribed, mockPayload, mockPostPollOption, mockUser, mockVerifyToken, mockVoteOnOption } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('POST /vote/:id', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('POST', '/api/vote/1234');
    });

    describe('poll option does not exist', () => {
        it('returns 404 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetPostPollOption.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .post('/api/vote/1234')
                .set('Authorization', 'Bearer token');

            expect(mockGetPostPollOption).toHaveBeenCalledWith('1234');
            expect(statusCode).toBe(404);
            expect(body.message).toBe('Ankieta nie istnieje');
        });
    });

    describe('user has no customer id', () => {
        it('returns 403 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetPostPollOption.mockResolvedValueOnce(mockPostPollOption);
            mockGetUserCustomerID.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .post('/api/vote/1234')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(403);
            expect(body.message).toBe('Nie subskrybujesz tego profilu');
        });
    });

    describe('plan id does not exist', () => {
        it('returns 404 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetPostPollOption.mockResolvedValueOnce(mockPostPollOption);
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockGetUserPlanID.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .post('/api/vote/1234')
                .set('Authorization', 'Bearer token');

            expect(mockGetUserPlanID).toHaveBeenCalledWith('123');
            expect(statusCode).toBe(404);
            expect(body.message).toBe('Użytkownik nie istnieje');
        });
    });

    describe('user does not subscribe the profile', () => {
        it('returns 403 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetPostPollOption.mockResolvedValueOnce(mockPostPollOption);
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockIsSubscribed.mockResolvedValueOnce(false);
            mockIsPollOptionMine.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .post('/api/vote/1234')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(403);
            expect(body.message).toBe('Nie subskrybujesz tego profilu');
        });
    });

    describe('user does not subscribe the profile but owns it', () => {
        it('does not return 403 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetPostPollOption.mockResolvedValueOnce(mockPostPollOption);
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockIsSubscribed.mockResolvedValueOnce(false);
            mockIsPollOptionMine.mockResolvedValueOnce(true);

            const { statusCode } = await supertest(app)
                .post('/api/vote/1234')
                .set('Authorization', 'Bearer token');

            expect(statusCode).not.toBe(403);
        });
    });

    describe('vote was successful', () => {
        it('calls the vote method', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetPostPollOption.mockResolvedValueOnce(mockPostPollOption);
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockIsSubscribed.mockResolvedValueOnce(true);
            mockIsPollOptionMine.mockResolvedValueOnce(false);

            await supertest(app)
                .post('/api/vote/1234')
                .set('Authorization', 'Bearer token');

            expect(mockVoteOnOption).toHaveBeenCalledWith('1234', '123');
        });

        it('returns 200 status and correct data', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetPostPollOption.mockResolvedValueOnce(mockPostPollOption);
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockIsSubscribed.mockResolvedValueOnce(true);
            mockIsPollOptionMine.mockResolvedValueOnce(false);
            mockVoteOnOption.mockResolvedValueOnce([
                { id: '123', percentage: 43 },
                { id: '1234', percentage: 7 },
                { id: '1235', percentage: 50 },
            ]);

            const { statusCode, body } = await supertest(app)
                .post('/api/vote/1234')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(200);
            expect(body).toEqual([
                { id: '123', percentage: 43 },
                { id: '1234', percentage: 7 },
                { id: '1235', percentage: 50 },
            ]);
        });
    });
});