import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockCreateStripeCheckout, mockCreateStripeCustomer, mockFindUserByEmail, mockGetUserCustomerID, mockGetUserPlanID, mockPayload, mockUser, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('POST /subscribe/:id', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('POST', '/api/subscribe/123');
    });

    describe('user without channel or no user was found', () => {
        it('returns 404 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .post('/api/subscribe/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(404);
            expect(body.message).toBe('Użytkownik nie posiada kanału');
        });
    });

    describe('user has no stripe customer associated', () => {
        it('creates stripe customer and associates it to the correct user', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockGetUserCustomerID.mockResolvedValueOnce(undefined);
            mockCreateStripeCustomer.mockResolvedValueOnce('customerID');
            mockCreateStripeCheckout.mockResolvedValueOnce('https://stripe.com/checkout');

            await supertest(app)
                .post('/api/subscribe/123')
                .set('Authorization', 'Bearer token');

            expect(mockGetUserCustomerID).toHaveBeenCalledWith(mockPayload.id);
            expect(mockCreateStripeCustomer).toHaveBeenCalledWith(mockPayload.id);
        });

        it('creates the stripe checkout', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockGetUserCustomerID.mockResolvedValueOnce(undefined);
            mockCreateStripeCustomer.mockResolvedValueOnce('customerID');
            mockCreateStripeCheckout.mockResolvedValueOnce('https://stripe.com/checkout');

            await supertest(app)
                .post('/api/subscribe/123')
                .set('Authorization', 'Bearer token');

            expect(mockCreateStripeCheckout).toHaveBeenCalledWith('customerID', 'planID', '123');
        });

        it('returns 200 status and a checkout url', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockGetUserCustomerID.mockResolvedValueOnce(undefined);
            mockCreateStripeCustomer.mockResolvedValueOnce('customerID');
            mockCreateStripeCheckout.mockResolvedValueOnce('https://stripe.com/checkout');

            const { statusCode, body } = await supertest(app)
                .post('/api/subscribe/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(200);
            expect(body.url).toBe('https://stripe.com/checkout');
        });
    });

    describe('user has a stripe customer associated', () => {
        it('creates the stripe checkout', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockCreateStripeCheckout.mockResolvedValueOnce('https://stripe.com/checkout');

            await supertest(app)
                .post('/api/subscribe/123')
                .set('Authorization', 'Bearer token');

            expect(mockCreateStripeCheckout).toHaveBeenCalledWith('customerID', 'planID', '123');
        });

        it('returns 200 status and a checkout url', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockGetUserCustomerID.mockResolvedValueOnce('customerID');
            mockCreateStripeCheckout.mockResolvedValueOnce('https://stripe.com/checkout');

            const { statusCode, body } = await supertest(app)
                .post('/api/subscribe/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(200);
            expect(body.url).toBe('https://stripe.com/checkout');
        });
    });
});