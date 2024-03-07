import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockFindUserByEmail, mockGetMyVote, mockIsSubscribedToPollOwner, mockPayload, mockUser, mockVerifyToken, mockVoteOnOption } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('GET /poll-votes/:id', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('GET', '/api/poll-votes/123');
    });


    describe('poll does not exist', () => {
        it('returns 404 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetMyVote.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .get('/api/poll-votes/123')
                .set('Authorization', 'Bearer token');

            expect(mockGetMyVote).toHaveBeenCalledWith('123', '123');
            expect(statusCode).toBe(404);
            expect(body.message).toBe('Ankieta nie istnieje');
        });
    });

    describe('user is not subscribed to the poll owner', () => {
        it('returns 403 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetMyVote.mockResolvedValueOnce('optionID');
            mockIsSubscribedToPollOwner.mockResolvedValueOnce(false);

            const { statusCode, body } = await supertest(app)
                .get('/api/poll-votes/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(403);
            expect(body.message).toBe('Nie subskrybujesz tego profilu');
        });
    });

    describe('user has no vote in the poll', () => {
        it('returns 200 status and correct data', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetMyVote.mockResolvedValueOnce(false);
            mockIsSubscribedToPollOwner.mockResolvedValueOnce(true);

            const { statusCode, body } = await supertest(app)
                .get('/api/poll-votes/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(200);
            expect(body).toEqual({ selectedOption: null, percentages: [] });
        });
    });

    describe('user has a vote', () => {
        it('calls the percentages method with correct arguments', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetMyVote.mockResolvedValueOnce('optionID');
            mockIsSubscribedToPollOwner.mockResolvedValueOnce(true);

            await supertest(app)
                .get('/api/poll-votes/123')
                .set('Authorization', 'Bearer token');

            expect(mockVoteOnOption).toHaveBeenCalledWith('optionID', '123');
        });

        it('returns 200 status and correct data', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetMyVote.mockResolvedValueOnce('optionID');
            mockIsSubscribedToPollOwner.mockResolvedValueOnce(true);
            mockVoteOnOption.mockResolvedValueOnce([
                { id: '123', percentage: 43 },
                { id: '1234', percentage: 7 },
                { id: '1235', percentage: 50 },
            ]);

            const { statusCode, body } = await supertest(app)
                .get('/api/poll-votes/123')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(200);
            expect(body).toEqual({
                selectedOption: 'optionID',
                percentages: [
                    { id: '123', percentage: 43 },
                    { id: '1234', percentage: 7 },
                    { id: '1235', percentage: 50 },
                ]
            });
        });
    });
});