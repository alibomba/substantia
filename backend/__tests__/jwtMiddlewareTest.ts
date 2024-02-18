import supertest from "supertest";
import app from "../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockFindUserByEmail, mockPayload, mockVerifyToken } from "./mocks";

vi.mock('../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

function jwtMiddlewareTest(method: 'GET' | 'POST' | 'PUT' | 'DELETE', route: string) {
    describe('no token given in header', () => {
        it('returns 401 status and a message', async () => {
            let statusCode;
            let body;
            switch (method) {
                case 'GET':
                    let get = await supertest(app)
                        .get(route);
                    statusCode = get.statusCode;
                    body = get.body;
                    break;
                case 'POST':
                    let post = await supertest(app)
                        .post(route);
                    statusCode = post.statusCode;
                    body = post.body;
                    break;
                case 'PUT':
                    let put = await supertest(app)
                        .put(route);
                    statusCode = put.statusCode;
                    body = put.body;
                    break;
                case 'DELETE':
                    let delete_ = await supertest(app)
                        .delete(route);
                    statusCode = delete_.statusCode;
                    body = delete_.body;
                    break;
            }
            expect(statusCode).toBe(401);
            expect(body.message).toBe('Nie znaleziono tokena');
        });
    });

    describe('incorrect token given in header', () => {
        it('returns 401 status and a message', async () => {
            mockVerifyToken.mockRejectedValueOnce({ message: 'jwt error' });
            let statusCode;
            let body;
            switch (method) {
                case 'GET':
                    let get = await supertest(app)
                        .get(route)
                        .set('Authorization', 'Bearer token');
                    statusCode = get.statusCode;
                    body = get.body;
                    break;
                case 'POST':
                    let post = await supertest(app)
                        .post(route)
                        .set('Authorization', 'Bearer token');
                    statusCode = post.statusCode;
                    body = post.body;
                    break;
                case 'PUT':
                    let put = await supertest(app)
                        .put(route)
                        .set('Authorization', 'Bearer token');
                    statusCode = put.statusCode;
                    body = put.body;
                    break;
                case 'DELETE':
                    let delete_ = await supertest(app)
                        .delete(route)
                        .set('Authorization', 'Bearer token');
                    statusCode = delete_.statusCode;
                    body = delete_.body;
                    break;
            }

            expect(statusCode).toBe(401);
            expect(body.message).toBe('jwt error');
        });
    });

    describe('user does not exist', () => {
        it('returns 401 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(null);
            let statusCode;
            let body;
            switch (method) {
                case 'GET':
                    let get = await supertest(app)
                        .get(route)
                        .set('Authorization', 'Bearer token');
                    statusCode = get.statusCode;
                    body = get.body;
                    break;
                case 'POST':
                    let post = await supertest(app)
                        .post(route)
                        .set('Authorization', 'Bearer token');
                    statusCode = post.statusCode;
                    body = post.body;
                    break;
                case 'PUT':
                    let put = await supertest(app)
                        .put(route)
                        .set('Authorization', 'Bearer token');
                    statusCode = put.statusCode;
                    body = put.body;
                    break;
                case 'DELETE':
                    let delete_ = await supertest(app)
                        .delete(route)
                        .set('Authorization', 'Bearer token');
                    statusCode = delete_.statusCode;
                    body = delete_.body;
                    break;
            }

            expect(statusCode).toBe(401);
            expect(body.message).toBe('Użytkownik nie istnieje');
        });
    });
}

export default jwtMiddlewareTest;