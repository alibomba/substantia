import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockCreateUser, mockFindUserByEmail, mockFindUserBySlug, mockHashPassword, mockUser } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('POST /register', () => {
    describe('invalid data given', () => {
        it('returns 422 status and a message', async () => {
            const invalidData = [
                { email: '', username: '', slug: '', password: '' },
                { email: '', username: 'testuser', slug: 'testslug', password: 'qwerty123' },
                { email: 'test@gmail.com', username: '', slug: 'testslug', password: 'qwerty123' },
                { email: 'test@gmail.com', username: 'testuser', slug: '', password: 'qwerty123' },
                { email: 'test@gmail.com', username: 'testuser', slug: 'testslug', password: '' },
                { email: 'testtesttes@gmail.com', username: 'testuser', slug: 'testslug', password: 'qwerty123' },
                { email: 'testgmail.com', username: 'testuser', slug: 'testslug', password: 'qwerty123' },
                { email: 'test@gmail.com', username: 'testtesttesttesttestt', slug: 'testslug', password: 'qwerty123' },
                { email: 'test@gmail.com', username: 'testuser', slug: 'testslugtestslugtests', password: 'qwerty123' },
                { email: 'test@gmail.com', username: 'testuser', slug: 'testslug', password: 'qwerty' },
                { email: 'test@gmail.com', username: 'testuser', slug: 'testslug', password: 'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyq' }
            ];

            await Promise.all(invalidData.map(async data => {
                const { statusCode, body } = await supertest(app)
                    .post('/api/register')
                    .send(data);

                expect(statusCode).toBe(422);
                expect(body.message).toEqual(expect.any(String));
            }));
        });
    });

    describe('e-mail duplicate given', () => {
        it('returns 422 status and a message', async () => {
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            const { statusCode, body } = await supertest(app)
                .post('/api/register')
                .send({ email: 'test@gmail.com', username: 'testuser', slug: 'testslug', password: 'qwerty123' });

            expect(statusCode).toBe(422);
            expect(body.message).toEqual(expect.any(String));
        });
    });

    describe('slug duplicate given', () => {
        it('returns 422 status and a message', async () => {
            mockFindUserByEmail.mockResolvedValueOnce(null);
            mockFindUserBySlug.mockResolvedValueOnce(mockUser);
            const { statusCode, body } = await supertest(app)
                .post('/api/register')
                .send({ email: 'test@gmail.com', username: 'testuser', slug: 'testslug', password: 'qwerty123' });

            expect(statusCode).toBe(422);
            expect(body.message).toEqual(expect.any(String));
        });
    });

    describe('valid data given', () => {
        it('hashes the password', async () => {
            mockFindUserByEmail.mockResolvedValueOnce(null);
            mockFindUserBySlug.mockResolvedValueOnce(null);
            await supertest(app)
                .post('/api/register')
                .send({ email: 'test@gmail.com', username: 'testuser', slug: 'testslug', password: 'qwerty123' });

            expect(mockHashPassword).toHaveBeenCalledWith('qwerty123');
        });

        it('creates the user', async () => {
            mockFindUserByEmail.mockResolvedValueOnce(null);
            mockFindUserBySlug.mockResolvedValueOnce(null);
            mockHashPassword.mockResolvedValueOnce('hashedPassword');
            await supertest(app)
                .post('/api/register')
                .send({ email: 'test@gmail.com', username: 'testuser', slug: 'testslug', password: 'qwerty123' });

            expect(mockCreateUser).toHaveBeenCalledWith('test@gmail.com', 'testuser', 'testslug', 'hashedPassword');
        });

        it('returns 201 status and a user without password', async () => {
            mockFindUserByEmail.mockResolvedValueOnce(null);
            mockFindUserBySlug.mockResolvedValueOnce(null);
            mockHashPassword.mockResolvedValueOnce('hashedPassword');
            mockCreateUser.mockResolvedValueOnce(mockUser);
            const { statusCode, body } = await supertest(app)
                .post('/api/register')
                .send({ email: 'test@gmail.com', username: 'testuser', slug: 'testslug', password: 'qwerty123' });

            expect(statusCode).toBe(201);
            const user = { ...mockUser, createdAt: expect.any(String) } as { password?: string };
            delete user.password;
            expect(body).toEqual(user);
        });
    });
});