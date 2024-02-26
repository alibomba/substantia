import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockFindUserByEmail, mockGetProfilesByPhrase, mockPayload, mockUser, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('GET /search', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('GET', '/api/search');
    });

    describe('no phrase was given', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);

            const { statusCode, body } = await supertest(app)
                .get('/api/search')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Fraza jest wymagana');
        });
    });

    describe('no profiles were found', () => {
        it('returns 200 status and an empty array', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetProfilesByPhrase.mockResolvedValueOnce([]);

            const { statusCode, body } = await supertest(app)
                .get('/api/search?phrase=test')
                .set('Authorization', 'Bearer token');

            expect(mockGetProfilesByPhrase).toHaveBeenCalledWith('test');
            expect(statusCode).toBe(200);
            expect(body).toEqual([]);
        });
    });

    describe('profiles were found', () => {
        it('returns 200 status and an array of profiles', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            const profiles = [
                {
                    id: '123', avatar: 'https://azure.com/pfp.jpg', username: 'TestUser', slug: 'testuser', description: 'test description'
                },
                {
                    id: '123', avatar: 'https://azure.com/pfp.jpg', username: 'AnotherUser', slug: 'anotheruser', description: 'another description'
                }
            ]
            mockGetProfilesByPhrase.mockResolvedValueOnce(profiles);

            const { statusCode, body } = await supertest(app)
                .get('/api/search?phrase=test')
                .set('Authorization', 'Bearer token');

            expect(mockGetProfilesByPhrase).toHaveBeenCalledWith('test');
            expect(statusCode).toBe(200);
            expect(body).toEqual(profiles);
        });
    });
});