import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockCreateOAuthUser, mockFindUserByEmail, mockGetGoogleUser, mockGoogleUserPayload, mockGoogleUserPayloadNoEmail, mockOAuthUser, mockPayload, mockSaveToken, mockSignToken, mockUser } from "../mocks";
import * as utils from '../../utils';
import { MyJWTPayload } from "../../types";

vi.mock('../../models/prisma');

const mockGenerateUsername = vi.spyOn(utils, 'generateUsername');
const mockGenerateSlug = vi.spyOn(utils, 'generateUniqueSlug');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('POST /google-login', () => {
    describe('no token was given', () => {
        it('returns 401 status and a message', async () => {
            const { statusCode, body } = await supertest(app)
                .post('/api/google-login');

            expect(statusCode).toBe(401);
            expect(body.message).toBe('Token jest wymagany');
        });
    });

    describe('incorrect token was given', () => {
        it('returns 401 status and a message', async () => {
            mockGetGoogleUser.mockRejectedValueOnce(new Error('Token nieprawidłowy', { cause: 'AUTHORIZATION' }));
            const { statusCode, body } = await supertest(app)
                .post('/api/google-login')
                .send({ token: 'token' });

            expect(statusCode).toBe(401);
            expect(body.message).toBe('Token nieprawidłowy');
        });
    });

    describe('google user has no e-mail', () => {
        it('returns 422 status and a message', async () => {
            mockGetGoogleUser.mockResolvedValueOnce(mockGoogleUserPayloadNoEmail);
            const { statusCode, body } = await supertest(app)
                .post('/api/google-login')
                .send({ token: 'token' });

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Adres e-mail jest wymagany');
        });
    });

    describe('user with oAuth was found', () => {
        it('signs 2 tokens with correct payload', async () => {
            mockGetGoogleUser.mockResolvedValueOnce(mockGoogleUserPayload);
            mockFindUserByEmail.mockResolvedValueOnce({ ...mockUser, oAuth: true });
            mockSignToken.mockReturnValueOnce('accessToken');
            mockSignToken.mockReturnValueOnce('refreshToken');

            await supertest(app)
                .post('/api/google-login')
                .send({ token: 'token' });

            expect(mockSignToken).toHaveBeenNthCalledWith(1, mockPayload, 'access');
            expect(mockSignToken).toHaveBeenNthCalledWith(2, mockPayload, 'refresh');
        });

        it('saves refresh token', async () => {
            mockGetGoogleUser.mockResolvedValueOnce(mockGoogleUserPayload);
            mockFindUserByEmail.mockResolvedValueOnce({ ...mockUser, oAuth: true });
            mockSignToken.mockReturnValueOnce('accessToken');
            mockSignToken.mockReturnValueOnce('refreshToken');

            await supertest(app)
                .post('/api/google-login')
                .send({ token: 'token' });

            expect(mockSaveToken).toHaveBeenCalledWith('refreshToken');
        });

        it('returns 200 status, access token, refresh token and a user payload', async () => {
            mockGetGoogleUser.mockResolvedValueOnce(mockGoogleUserPayload);
            mockFindUserByEmail.mockResolvedValueOnce({ ...mockUser, oAuth: true });
            mockSignToken.mockReturnValueOnce('accessToken');
            mockSignToken.mockReturnValueOnce('refreshToken');

            const { statusCode, body } = await supertest(app)
                .post('/api/google-login')
                .send({ token: 'token' });

            expect(statusCode).toBe(200);
            expect(body).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken', payload: mockPayload });
        });
    });

    describe('no user was found', () => {
        it('generates username and slug', async () => {
            mockGetGoogleUser.mockResolvedValueOnce(mockGoogleUserPayload);
            mockFindUserByEmail.mockResolvedValueOnce(null);
            mockGenerateUsername.mockReturnValueOnce('test');
            mockGenerateSlug.mockResolvedValueOnce('test');
            mockCreateOAuthUser.mockResolvedValueOnce(mockOAuthUser);

            await supertest(app)
                .post('/api/google-login')
                .send({ token: 'token' });

            expect(mockGenerateUsername).toHaveBeenCalledWith('test@gmail.com');
            expect(mockGenerateSlug).toHaveBeenCalledWith('test@gmail.com');
        });

        it('creates a new user with correct data', async () => {
            mockGetGoogleUser.mockResolvedValueOnce(mockGoogleUserPayload);
            mockFindUserByEmail.mockResolvedValueOnce(null);
            mockGenerateUsername.mockReturnValueOnce('test');
            mockGenerateSlug.mockResolvedValueOnce('test');
            mockCreateOAuthUser.mockResolvedValueOnce(mockOAuthUser);

            await supertest(app)
                .post('/api/google-login')
                .send({ token: 'token' });

            expect(mockCreateOAuthUser).toHaveBeenCalledWith('test@gmail.com', 'test', 'test');
        });

        it('signs 2 tokens with correct payload', async () => {
            mockGetGoogleUser.mockResolvedValueOnce(mockGoogleUserPayload);
            mockFindUserByEmail.mockResolvedValueOnce(null);
            mockGenerateUsername.mockReturnValueOnce('test');
            mockGenerateSlug.mockResolvedValueOnce('test');
            mockCreateOAuthUser.mockResolvedValueOnce(mockOAuthUser);
            mockSignToken.mockReturnValueOnce('accessToken');
            mockSignToken.mockReturnValueOnce('refreshToken');

            await supertest(app)
                .post('/api/google-login')
                .send({ token: 'token' });

            const payload: MyJWTPayload = { id: '123', email: 'test@gmail.com', username: 'test', slug: 'test', avatar: null, hasChannel: false };

            expect(mockSignToken).toHaveBeenNthCalledWith(1, payload, 'access');
            expect(mockSignToken).toHaveBeenNthCalledWith(2, payload, 'refresh');
        });

        it('saves refresh token', async () => {
            mockGetGoogleUser.mockResolvedValueOnce(mockGoogleUserPayload);
            mockFindUserByEmail.mockResolvedValueOnce(null);
            mockGenerateUsername.mockReturnValueOnce('test');
            mockGenerateSlug.mockResolvedValueOnce('test');
            mockCreateOAuthUser.mockResolvedValueOnce(mockOAuthUser);
            mockSignToken.mockReturnValueOnce('accessToken');
            mockSignToken.mockReturnValueOnce('refreshToken');

            await supertest(app)
                .post('/api/google-login')
                .send({ token: 'token' });

            expect(mockSaveToken).toHaveBeenCalledWith('refreshToken');
        });

        it('returns 201 status, access token, refresh token, and a user payload', async () => {
            mockGetGoogleUser.mockResolvedValueOnce(mockGoogleUserPayload);
            mockFindUserByEmail.mockResolvedValueOnce(null);
            mockGenerateUsername.mockReturnValueOnce('test');
            mockGenerateSlug.mockResolvedValueOnce('test');
            mockCreateOAuthUser.mockResolvedValueOnce(mockOAuthUser);
            mockSignToken.mockReturnValueOnce('accessToken');
            mockSignToken.mockReturnValueOnce('refreshToken');

            const { statusCode, body } = await supertest(app)
                .post('/api/google-login')
                .send({ token: 'token' });

            const payload: MyJWTPayload = { id: '123', email: 'test@gmail.com', username: 'test', slug: 'test', avatar: null, hasChannel: false };

            expect(statusCode).toBe(201);
            expect(body).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken', payload });
        });
    });

    describe('user without oAuth was found', () => {
        it('returns 422 status and a message', async () => {
            mockGetGoogleUser.mockResolvedValueOnce(mockGoogleUserPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);

            const { statusCode, body } = await supertest(app)
                .post('/api/google-login')
                .send({ token: 'token' });

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Adres e-mail jest już zajęty');
        });
    });
});