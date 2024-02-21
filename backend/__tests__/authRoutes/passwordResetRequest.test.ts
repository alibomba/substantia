import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockCreatePasswordResetToken, mockFindUserByEmail, mockOAuthUser, mockSendPasswordResetToken, mockUser } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('POST /password-reset', () => {
    describe('no e-mail was given', () => {
        it('returns 422 status and a message', async () => {
            const { statusCode, body } = await supertest(app)
                .post('/api/password-reset');

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Adres e-mail jest wymagany');
        });
    });

    describe('no user was found', () => {
        it('returns 422 status and a message', async () => {
            mockFindUserByEmail.mockResolvedValueOnce(null);
            const { statusCode, body } = await supertest(app)
                .post('/api/password-reset')
                .send({ email: 'test@gmail.com' });

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Użytkownik o podanym adresie e-mail nie istnieje');
        });
    });

    describe('found user has oAuth', () => {
        it('returns 422 status and a message', async () => {
            mockFindUserByEmail.mockResolvedValueOnce(mockOAuthUser);

            const { statusCode, body } = await supertest(app)
                .post('/api/password-reset')
                .send({ email: 'test@gmail.com' });

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Użytkownik nie posiada hasła, zaloguj się za pomocą Google');
        });
    });

    describe('correct e-mail was given', () => {
        it('creates the password reset token', async () => {
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockCreatePasswordResetToken.mockResolvedValueOnce('resetToken');

            await supertest(app)
                .post('/api/password-reset')
                .send({ email: 'test@gmail.com' });

            expect(mockCreatePasswordResetToken).toHaveBeenCalledWith('test@gmail.com');
        });

        it('sends an e-mail with a reset token to the correct user and returns 204 status', async () => {
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockCreatePasswordResetToken.mockResolvedValueOnce('resetToken');

            const { statusCode } = await supertest(app)
                .post('/api/password-reset')
                .send({ email: 'test@gmail.com' });

            expect(mockSendPasswordResetToken).toHaveBeenCalledWith('test@gmail.com', 'resetToken');
            expect(statusCode).toBe(204);
        });
    });
});