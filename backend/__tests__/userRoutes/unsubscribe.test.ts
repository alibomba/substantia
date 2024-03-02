import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockDeleteSubscription, mockFindUserByEmail, mockGetUserCustomerID, mockGetUserPlanID, mockIsSubscribed, mockPayload, mockUser, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('DELETE /unsubscribe/:id', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('DELETE', '/api/unsubscribe/12345');
    });

    describe('user tries to unsubscribe themself', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);

            const { statusCode, body } = await supertest(app)
                .delete('/api/unsubscribe/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Nie możesz subskrybować samego siebie');
        });
    });

    describe('profile has no channel or does not exist', () => {
        it('returns 404 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .delete('/api/unsubscribe/12345')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(404);
            expect(body.message).toBe('Użytkownik nie posiada kanału');
        });
    });

    describe('user has no customerID associated', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce('planID');

            const { statusCode, body } = await supertest(app)
                .delete('/api/unsubscribe/12345')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Nie subskrybujesz tego profilu');
        });
    });

    describe('user has a customerID associated but is not subsribed to the profile', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce({ ...mockUser, stripeCustomerID: 'customerID' });
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockIsSubscribed.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .delete('/api/unsubscribe/12345')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Nie subskrybujesz tego profilu');
        });
    });

    describe('user is subscribed', () => {
        it('deletes a subscription', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce({ ...mockUser, stripeCustomerID: 'customerID' });
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockIsSubscribed.mockResolvedValueOnce(true);

            await supertest(app)
                .delete('/api/unsubscribe/12345')
                .set('Authorization', 'Bearer token');

            expect(mockDeleteSubscription).toHaveBeenCalledWith('customerID', 'planID');
        });

        it('returns 204 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce({ ...mockUser, stripeCustomerID: 'customerID' });
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockIsSubscribed.mockResolvedValueOnce(true);

            const { statusCode } = await supertest(app)
                .delete('/api/unsubscribe/12345')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(204);
        });
    });
});