import supertest from "supertest";
import app from "../../app";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwtMiddlewareTest from "../jwtMiddlewareTest";
import { mockContentOnlyPost, mockCreatePost, mockCreatePostImage, mockCreatePostPoll, mockCreatePostPollOption, mockFindUserByEmail, mockGenerateUniqueId, mockGetAzureObject, mockGetPost, mockPayload, mockPostAzureObject, mockPostPoll, mockUser, mockVerifyToken, mockWithVideoPost } from "../mocks";
vi.mock('../../models/prisma');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('POST /posts', () => {
    describe('unauthorized access', () => {
        jwtMiddlewareTest('POST', '/api/posts');
    });

    describe('invalid text fields given', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValue(mockPayload);
            mockFindUserByEmail.mockResolvedValue(mockUser);
            const invalidData = [
                { content: '' },
                { content: 'x'.repeat(501) },
                { content: 'test content', poll: '{' },
                { content: 'test content', poll: '["option1", "option2"' },
                { content: 'test content', poll: '{"key": "value"}' },
                { content: 'test content', poll: 'string' },
                { content: 'test content', poll: '["option1", "wasdwasdwasdwasdwasdw"]' }
            ];
            await Promise.all(invalidData.map(async data => {
                const { statusCode, body } = await supertest(app)
                    .post('/api/posts')
                    .send(data)
                    .set('Authorization', 'Bearer token');

                expect(statusCode).toBe(422);
                expect(body.message).toEqual(expect.any(String));
            }));
        });
    });

    describe('image field is too big', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);

            const { statusCode, body } = await supertest(app)
                .post('/api/posts')
                .attach('images', `${__dirname}/../mockFiles/7MBimage.jpg`)
                .field('content', 'test content')
                .set('Authorization', 'Bearer token')
                .set('Content-Type', 'multipart/form-data');

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Każdy obraz może mieć maksymalnie 4MB');
        });
    });

    describe('one of image fields is too big', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);

            const { statusCode, body } = await supertest(app)
                .post('/api/posts')
                .attach('images', `${__dirname}/../mockFiles/3MBimage.jpg`)
                .attach('images', `${__dirname}/../mockFiles/7MBimage.jpg`)
                .field('content', 'test content')
                .set('Authorization', 'Bearer token')
                .set('Content-Type', 'multipart/form-data');

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Każdy obraz może mieć maksymalnie 4MB');
        });
    });

    describe('both images and video given', () => {
        it('returns 422 status and a message', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);

            const { statusCode, body } = await supertest(app)
                .post('/api/posts')
                .attach('images', `${__dirname}/../mockFiles/3MBimage.jpg`)
                .attach('video', `${__dirname}/../mockFiles/6MBvideo.mp4`)
                .field('content', 'test content')
                .set('Authorization', 'Bearer token')
                .set('Content-Type', 'multipart/form-data');

            expect(statusCode).toBe(422);
            expect(body.message).toBe('Post nie może mieć filmu i zdjęć naraz');
        });
    });

    describe('post only with content given', () => {
        it('creates a new post', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockCreatePost.mockResolvedValueOnce(mockContentOnlyPost);

            await supertest(app)
                .post('/api/posts')
                .send({ content: 'test content' })
                .set('Authorization', 'Bearer token');

            expect(mockCreatePost).toHaveBeenCalledWith('test content', mockPayload.id, undefined);
        });

        it('returns 201 status and a new post', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockCreatePost.mockResolvedValueOnce(mockContentOnlyPost);
            const mockNewPost = {
                id: '123',
                content: 'test content',
                videoPath: null,
                images: [],
                poll: null,
                userId: '123',
                user: {
                    id: '123',
                    username: 'TestUser',
                    slug: 'testuser',
                    avatar: 'https://azure.com/pfp.png'
                },
                createdAt: new Date()
            }
            mockGetPost.mockResolvedValueOnce(mockNewPost);

            const { statusCode, body } = await supertest(app)
                .post('/api/posts')
                .send({ content: 'test content' })
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(201);
            expect(body).toEqual({ ...mockNewPost, createdAt: expect.any(String) });
        });
    });

    describe('post with one image given', () => {
        it('creates a new post', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockCreatePost.mockResolvedValueOnce(mockContentOnlyPost);
            mockPostAzureObject.mockResolvedValueOnce(expect.any(Object));

            await supertest(app)
                .post('/api/posts')
                .attach('images', `${__dirname}/../mockFiles/3MBimage.jpg`)
                .field('content', 'test content')
                .set('Authorization', 'Bearer token');

            expect(mockCreatePost).toHaveBeenCalledWith('test content', mockPayload.id, undefined);
        });

        it('creates the image in the DB', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockCreatePost.mockResolvedValueOnce(mockContentOnlyPost);
            mockPostAzureObject.mockResolvedValueOnce(expect.any(Object));
            mockGenerateUniqueId.mockReturnValueOnce('uuid');

            await supertest(app)
                .post('/api/posts')
                .attach('images', `${__dirname}/../mockFiles/3MBimage.jpg`)
                .field('content', 'test content')
                .set('Authorization', 'Bearer token');

            expect(mockCreatePostImage).toHaveBeenCalledWith('uuid', '123');
        });

        it('posts the image to the azure blob storage', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockCreatePost.mockResolvedValueOnce(mockContentOnlyPost);
            mockPostAzureObject.mockResolvedValueOnce(expect.any(Object));
            mockGenerateUniqueId.mockReturnValueOnce('uuid');

            await supertest(app)
                .post('/api/posts')
                .attach('images', `${__dirname}/../mockFiles/3MBimage.jpg`)
                .field('content', 'test content')
                .set('Authorization', 'Bearer token');

            expect(mockPostAzureObject).toHaveBeenCalledWith(expect.any(Buffer), 'postImages/uuid', expect.any(String));
        });

        it('returns 201 status and a new post', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockCreatePost.mockResolvedValueOnce(mockContentOnlyPost);
            mockPostAzureObject.mockResolvedValueOnce(expect.any(Object));
            mockGenerateUniqueId.mockReturnValueOnce('uuid');
            const mockNewPost = {
                id: '123',
                content: 'test content',
                videoPath: null,
                images: [{ id: '123', path: 'postImages/uuid', postId: '123', createdAt: new Date() }],
                poll: null,
                userId: '123',
                user: {
                    id: '123',
                    username: 'TestUser',
                    slug: 'testuser',
                    avatar: 'https://azure.com/pfp.png'
                },
                createdAt: new Date()
            }
            const mockExpectedPost = {
                id: '123',
                content: 'test content',
                videoPath: null,
                images: [{ id: '123', path: 'postImages/uuid', postId: '123', createdAt: expect.any(String) }],
                poll: null,
                userId: '123',
                user: {
                    id: '123',
                    username: 'TestUser',
                    slug: 'testuser',
                    avatar: 'https://azure.com/pfp.png'
                },
                createdAt: expect.any(String)
            }
            mockGetPost.mockResolvedValueOnce(mockNewPost);

            const { statusCode, body } = await supertest(app)
                .post('/api/posts')
                .attach('images', `${__dirname}/../mockFiles/3MBimage.jpg`)
                .field('content', 'test content')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(201);
            expect(body).toEqual(mockExpectedPost);
        });
    });

    describe('post with multiple images given', () => {
        it('creates a new post', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockCreatePost.mockResolvedValueOnce(mockContentOnlyPost);
            mockPostAzureObject.mockResolvedValue(expect.any(Object));

            await supertest(app)
                .post('/api/posts')
                .attach('images', `${__dirname}/../mockFiles/3MBimage.jpg`)
                .attach('images', `${__dirname}/../mockFiles/3MBimage.jpg`)
                .field('content', 'test content')
                .set('Authorization', 'Bearer token');

            expect(mockCreatePost).toHaveBeenCalledWith('test content', mockPayload.id, undefined);
        });

        it('creates the images in the DB', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockCreatePost.mockResolvedValueOnce(mockContentOnlyPost);
            mockPostAzureObject.mockResolvedValue(expect.any(Object));
            mockGenerateUniqueId.mockReturnValue('uuid');

            await supertest(app)
                .post('/api/posts')
                .attach('images', `${__dirname}/../mockFiles/3MBimage.jpg`)
                .attach('images', `${__dirname}/../mockFiles/3MBimage.jpg`)
                .field('content', 'test content')
                .set('Authorization', 'Bearer token');

            expect(mockCreatePostImage).toHaveBeenNthCalledWith(1, 'uuid', '123');
            expect(mockCreatePostImage).toHaveBeenNthCalledWith(2, 'uuid', '123');
        });

        it('posts the images to the azure blob storage', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockCreatePost.mockResolvedValueOnce(mockContentOnlyPost);
            mockPostAzureObject.mockResolvedValue(expect.any(Object));
            mockGenerateUniqueId.mockReturnValue('uuid');

            await supertest(app)
                .post('/api/posts')
                .attach('images', `${__dirname}/../mockFiles/3MBimage.jpg`)
                .attach('images', `${__dirname}/../mockFiles/3MBimage.jpg`)
                .field('content', 'test content')
                .set('Authorization', 'Bearer token');

            expect(mockPostAzureObject).toHaveBeenNthCalledWith(1, expect.any(Buffer), 'postImages/uuid', expect.any(String));
            expect(mockPostAzureObject).toHaveBeenNthCalledWith(2, expect.any(Buffer), 'postImages/uuid', expect.any(String));
        });

        it('returns 201 status and a new post', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockCreatePost.mockResolvedValueOnce(mockContentOnlyPost);
            mockPostAzureObject.mockResolvedValue(expect.any(Object));
            mockGenerateUniqueId.mockReturnValue('uuid');
            const mockNewPost = {
                id: '123',
                content: 'test content',
                videoPath: null,
                images: [{ id: '123', path: 'postImages/uuid', postId: '123', createdAt: new Date() }, { id: '123', path: 'postImages/uuid', postId: '123', createdAt: new Date() }],
                poll: null,
                userId: '123',
                user: {
                    id: '123',
                    username: 'TestUser',
                    slug: 'testuser',
                    avatar: 'https://azure.com/pfp.png'
                },
                createdAt: new Date()
            }
            const mockExpectedPost = {
                id: '123',
                content: 'test content',
                videoPath: null,
                images: [{ id: '123', path: 'postImages/uuid', postId: '123', createdAt: expect.any(String) }, { id: '123', path: 'postImages/uuid', postId: '123', createdAt: expect.any(String) }],
                poll: null,
                userId: '123',
                user: {
                    id: '123',
                    username: 'TestUser',
                    slug: 'testuser',
                    avatar: 'https://azure.com/pfp.png'
                },
                createdAt: expect.any(String)
            }
            mockGetPost.mockResolvedValueOnce(mockNewPost);

            const { statusCode, body } = await supertest(app)
                .post('/api/posts')
                .attach('images', `${__dirname}/../mockFiles/3MBimage.jpg`)
                .attach('images', `${__dirname}/../mockFiles/3MBimage.jpg`)
                .field('content', 'test content')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(201);
            expect(body).toEqual(mockExpectedPost);
        });
    });

    describe('post with a video given', () => {
        it('posts a video to the azure blob storage', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGenerateUniqueId.mockReturnValueOnce('uuid');
            mockPostAzureObject.mockResolvedValueOnce(expect.any(Object));
            mockCreatePost.mockResolvedValueOnce(mockWithVideoPost);

            await supertest(app)
                .post('/api/posts')
                .attach('video', `${__dirname}/../mockFiles/6MBvideo.mp4`)
                .field('content', 'test content')
                .set('Authorization', 'Bearer token');

            expect(mockPostAzureObject).toHaveBeenCalledWith(expect.any(Buffer), `postVideos/uuid`, expect.any(String));
        });

        it('creates a new post', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGenerateUniqueId.mockReturnValueOnce('uuid');
            mockPostAzureObject.mockResolvedValueOnce(expect.any(Object));
            mockCreatePost.mockResolvedValueOnce(mockWithVideoPost);

            await supertest(app)
                .post('/api/posts')
                .attach('video', `${__dirname}/../mockFiles/6MBvideo.mp4`)
                .field('content', 'test content')
                .set('Authorization', 'Bearer token');

            expect(mockCreatePost).toHaveBeenCalledWith('test content', mockPayload.id, 'uuid');
        });

        it('returns 201 status and a new post', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockGenerateUniqueId.mockReturnValueOnce('uuid');
            mockPostAzureObject.mockResolvedValueOnce(expect.any(Object));
            mockCreatePost.mockResolvedValueOnce(mockWithVideoPost);
            const mockNewPost = {
                id: '123',
                content: 'test content',
                videoPath: 'uuid',
                userId: '123',
                images: [],
                poll: null,
                user: {
                    id: '123',
                    username: 'TestUser',
                    slug: 'testuser',
                    avatar: 'https://azure.com/pfp.jpg'
                },
                createdAt: new Date()
            };
            mockGetPost.mockResolvedValueOnce(mockNewPost);

            const { statusCode, body } = await supertest(app)
                .post('/api/posts')
                .attach('video', `${__dirname}/../mockFiles/6MBvideo.mp4`)
                .field('content', 'test content')
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(201);
            expect(body).toEqual({ ...mockNewPost, createdAt: expect.any(String) });
        });
    });

    describe('post with a poll given', () => {
        it('creates a new post', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockCreatePost.mockResolvedValueOnce(mockContentOnlyPost);
            mockCreatePostPoll.mockResolvedValueOnce(mockPostPoll);

            await supertest(app)
                .post('/api/posts')
                .send({ content: 'test content', poll: '["option1", "option2", "option3"]' })
                .set('Authorization', 'Bearer token');

            expect(mockCreatePost).toHaveBeenCalledWith('test content', mockPayload.id, undefined);
        });

        it('creates a new poll', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockCreatePost.mockResolvedValueOnce(mockContentOnlyPost);
            mockCreatePostPoll.mockResolvedValueOnce(mockPostPoll);

            await supertest(app)
                .post('/api/posts')
                .send({ content: 'test content', poll: '["option1", "option2", "option3"]' })
                .set('Authorization', 'Bearer token');

            expect(mockCreatePostPoll).toHaveBeenCalledWith(mockContentOnlyPost.id);
        });

        it('creates all new poll options', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockCreatePost.mockResolvedValueOnce(mockContentOnlyPost);
            mockCreatePostPoll.mockResolvedValueOnce(mockPostPoll);
            mockCreatePostPollOption.mockResolvedValueOnce({ id: '123', label: 'option1', pollId: '123' })
                .mockResolvedValueOnce({ id: '123', label: 'option2', pollId: '123' })
                .mockResolvedValueOnce({ id: '123', label: 'option3', pollId: '123' });

            await supertest(app)
                .post('/api/posts')
                .send({ content: 'test content', poll: '["option1", "option2", "option3"]' })
                .set('Authorization', 'Bearer token');

            expect(mockCreatePostPollOption).toHaveBeenNthCalledWith(1, 'option1', '123');
            expect(mockCreatePostPollOption).toHaveBeenNthCalledWith(2, 'option2', '123');
            expect(mockCreatePostPollOption).toHaveBeenNthCalledWith(3, 'option3', '123');
        });

        it('returns 201 status and a new post', async () => {
            mockVerifyToken.mockResolvedValueOnce(mockPayload);
            mockFindUserByEmail.mockResolvedValueOnce(mockUser);
            mockCreatePost.mockResolvedValueOnce(mockContentOnlyPost);
            mockCreatePostPoll.mockResolvedValueOnce(mockPostPoll);
            const mockNewPost = {
                id: '123',
                content: 'test content',
                videoPath: null,
                userId: '123',
                images: [],
                poll: {
                    id: '123',
                    postId: '123',
                    options: [
                        {
                            id: '123',
                            label: 'option1',
                            pollId: '123',
                            votes: []
                        },
                        {
                            id: '123',
                            label: 'option2',
                            pollId: '123',
                            votes: []
                        },
                        {
                            id: '123',
                            label: 'option3',
                            pollId: '123',
                            votes: []
                        }
                    ],
                    createdAt: new Date()
                },
                user: {
                    id: '123',
                    username: 'TestUser',
                    slug: 'testuser',
                    avatar: 'https://azure.com/pfp.jpg'
                },
                createdAt: new Date()
            }
            mockGetPost.mockResolvedValueOnce(mockNewPost);

            const { statusCode, body } = await supertest(app)
                .post('/api/posts')
                .send({ content: 'test content', poll: '["option1", "option2", "option3"]' })
                .set('Authorization', 'Bearer token');

            expect(statusCode).toBe(201);
            expect(body).toEqual({
                id: '123',
                content: 'test content',
                videoPath: null,
                userId: '123',
                images: [],
                poll: {
                    id: '123',
                    postId: '123',
                    options: [
                        {
                            id: '123',
                            label: 'option1',
                            pollId: '123',
                            votes: []
                        },
                        {
                            id: '123',
                            label: 'option2',
                            pollId: '123',
                            votes: []
                        },
                        {
                            id: '123',
                            label: 'option3',
                            pollId: '123',
                            votes: []
                        }
                    ],
                    createdAt: expect.any(String)
                },
                user: {
                    id: '123',
                    username: 'TestUser',
                    slug: 'testuser',
                    avatar: 'https://azure.com/pfp.jpg'
                },
                createdAt: expect.any(String)
            });
        });
    });
});