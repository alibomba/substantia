import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockFindUserByEmail, mockHashPassword, mockUpdateUserPassword, mockUser, mockVerifyPasswordResetToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('POST /password-reset/:token', () => {
    describe('no password was given', () => {
        it('returns 422 status and a message', async () => {
            const { statusCode, body } = await supertest(app)
                .post('/api/password-reset/token');

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Hasło jest wymagane');
        });
    });

    describe('incorrect token was given', () => {
        it('returns 401 status and a message', async () => {
            mockVerifyPasswordResetToken.mockRejectedValueOnce({ message: 'token error' });

            const { statusCode, body } = await supertest(app)
                .post('/api/password-reset/token')
                .send({ newPassword: 'qwerty123' });

            expect(mockVerifyPasswordResetToken).toHaveBeenCalledWith('token');
            expect(statusCode).toBe(401);
            expect(body.message).toBe('Token nieprawidłowy');
        });
    });

    describe('user not found', () => {
        it('returns 401 status and a message', async () => {
            mockVerifyPasswordResetToken.mockResolvedValueOnce({ email: 'test@gmail.com' });
            mockFindUserByEmail.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .post('/api/password-reset/token')
                .send({ newPassword: 'qwerty123' });

            expect(statusCode).toBe(401);
            expect(body.message).toBe('Użytkownik nie istnieje');
        });
    });

    describe('correct request was made', () => {
        it('hashes the password', async () => {
            mockVerifyPasswordResetToken.mockResolvedValueOnce({ email: 'test@gmail.com' });
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockHashPassword.mockResolvedValueOnce('hashedPassword');

            await supertest(app)
                .post('/api/password-reset/token')
                .send({ newPassword: 'qwerty123' });

            expect(mockHashPassword).toHaveBeenCalledWith('qwerty123');
        });

        it('updates the user password', async () => {
            mockVerifyPasswordResetToken.mockResolvedValueOnce({ email: 'test@gmail.com' });
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockHashPassword.mockResolvedValueOnce('hashedPassword');
            mockUpdateUserPassword.mockResolvedValueOnce(mockUser);

            await supertest(app)
                .post('/api/password-reset/token')
                .send({ newPassword: 'qwerty123' });

            expect(mockUpdateUserPassword).toHaveBeenCalledWith(mockUser.id, 'hashedPassword');
        });

        it('returns 204 status', async () => {
            mockVerifyPasswordResetToken.mockResolvedValueOnce({ email: 'test@gmail.com' });
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockHashPassword.mockResolvedValueOnce('hashedPassword');
            mockUpdateUserPassword.mockResolvedValueOnce(mockUser);

            const { statusCode } = await supertest(app)
                .post('/api/password-reset/token')
                .send({ newPassword: 'qwerty123' });

            expect(statusCode).toBe(204);
        });
    });
});