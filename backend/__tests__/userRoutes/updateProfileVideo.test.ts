import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockFindUserByEmail, mockGenerateUniqueId, mockGetUserPlanID, mockPayload, mockPostAzureObject, mockUpdateProfileVideo, mockUser, mockVerifyToken } from "../mocks";

vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('PUT /update-profile-video', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('PUT', '/api/update-profile-video');
    });

    describe('user has no channel', () => {
        it('returns 403 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce(null);

            const { statusCode, body } = await supertest(app)
                .put('/api/update-profile-video')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(403);
            expect(body.message).toBe('Nie posiadasz kanału');
        });
    });

    describe('no profile video was given', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce('planID');

            const { statusCode, body } = await supertest(app)
                .put('/api/update-profile-video')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Filmik profilowy jest wymagany');
        });
    });

    describe('correct profile video was given', () => {
        it('posts the profile video to the azure blob storage', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockGenerateUniqueId.mockReturnValueOnce('uuid');
            mockPostAzureObject.mockResolvedValueOnce(expect.any(Object));

            await supertest(app)
                .put('/api/update-profile-video')
                .attach('profileVideo', `${__dirname}/../mockFiles/6MBvideo.mp4`)
                .set('Authorization', 'Bearer token');

            expect(mockPostAzureObject).toHaveBeenCalledWith(expect.any(Buffer), 'profileVideos/uuid', expect.any(String));
        });

        it('updates the profile video', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockGenerateUniqueId.mockReturnValueOnce('uuid');
            mockPostAzureObject.mockResolvedValueOnce(expect.any(Object));
            mockUpdateProfileVideo.mockResolvedValueOnce(expect.any(Object));

            await supertest(app)
                .put('/api/update-profile-video')
                .attach('profileVideo', `${__dirname}/../mockFiles/6MBvideo.mp4`)
                .set('Authorization', 'Bearer token');

            expect(mockUpdateProfileVideo).toHaveBeenCalledWith('123', 'uuid');
        });

        it('returns 204 status', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGetUserPlanID.mockResolvedValueOnce('planID');
            mockGenerateUniqueId.mockReturnValueOnce('uuid');
            mockPostAzureObject.mockResolvedValueOnce(expect.any(Object));
            mockUpdateProfileVideo.mockResolvedValueOnce(expect.any(Object));

            const { statusCode } = await supertest(app)
                .put('/api/update-profile-video')
                .attach('profileVideo', `${__dirname}/../mockFiles/6MBvideo.mp4`)
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(204);
        });
    });
});