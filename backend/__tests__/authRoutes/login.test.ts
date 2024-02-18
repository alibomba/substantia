import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockFindUserByEmail, mockSaveToken, mockSignToken, mockUser, mockVerifyPassword } from "../mocks";
import { MyJWTPayload } from "../../types";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('POST /login', () => {
    describe('incomplete credentials given', () => {
        it('returns 401 status and a message', async () => {
            const invalidData = [
                { email: '', password: '' },
                { email: '', password: 'qwerty123' },
                { email: 'test@gmail.com', password: '' },
            ];
            await Promise.all(invalidData.map(async data => {
                const { statusCode, body } = await supertest(app)
                    .post('/api/login')
                    .send(data);

                expect(statusCode).toBe(401);
                expect(body.message).toBe('Niepoprawny e-mail lub hasło');
            }));
        });
    });

    describe('invalid e-mail given', () => {
        it('returns 401 status and a message', async () => {
            mockFindUserByEmail.mockResolvedValueOnce(null);
            const { statusCode, body } = await supertest(app)
                .post('/api/login')
                .send({ email: 'test@gmail.com', password: 'qwerty123' });

            expect(statusCode).toBe(401);
            expect(body.message).toBe('Niepoprawny e-mail lub hasło');
        });
    });

    describe('account with oAuth given', () => {
        it('returns 401 status and a message', async () => {
            mockFindUserByEmail.mockResolvedValueOnce({ ...mockUser, oAuth: true });
            const { statusCode, body } = await supertest(app)
                .post('/api/login')
                .send({ email: 'test@gmail.com', password: 'qwerty123' });

            expect(statusCode).toBe(401);
            expect(body.message).toBe('Zaloguj się za pomocą Google');
        });
    });

    describe('invalid password given', () => {
        it('returns 401 status and a message', async () => {
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockVerifyPassword.mockResolvedValueOnce(false);
            const { statusCode, body } = await supertest(app)
                .post('/api/login')
                .send({ email: 'test@gmail.com', password: 'qwerty123' });

            expect(statusCode).toBe(401);
            expect(body.message).toBe('Niepoprawny e-mail lub hasło');
        });
    });

    describe('valid credentials given', () => {
        it('signs 2 tokens with correct payload', async () => {
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockVerifyPassword.mockResolvedValueOnce(true);
            mockSignToken.mockReturnValueOnce('accessToken');
            mockSignToken.mockReturnValueOnce('refreshToken');
            await supertest(app)
                .post('/api/login')
                .send({ email: 'test@gmail.com', password: 'qwerty123' });
            const payload: MyJWTPayload = { id: mockUser.id, email: mockUser.email, username: mockUser.username, slug: mockUser.slug, avatar: mockUser.avatar, hasChannel: mockUser.hasChannel };
            expect(mockSignToken).toHaveBeenNthCalledWith(1, payload, 'access');
            expect(mockSignToken).toHaveBeenNthCalledWith(2, payload, 'refresh');
        });

        it('saves the refresh token', async () => {
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockVerifyPassword.mockResolvedValueOnce(true);
            mockSignToken.mockReturnValueOnce('accessToken');
            mockSignToken.mockReturnValueOnce('refreshToken');
            await supertest(app)
                .post('/api/login')
                .send({ email: 'test@gmail.com', password: 'qwerty123' });

            expect(mockSaveToken).toHaveBeenCalledWith('refreshToken');
        });

        it('returns 200 status and access and refresh tokens', async () => {
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockVerifyPassword.mockResolvedValueOnce(true);
            mockSignToken.mockReturnValueOnce('accessToken');
            mockSignToken.mockReturnValueOnce('refreshToken');
            const { statusCode, body } = await supertest(app)
                .post('/api/login')
                .send({ email: 'test@gmail.com', password: 'qwerty123' });

            expect(statusCode).toBe(200);
            expect(body).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
        });
    });
});