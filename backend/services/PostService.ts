import prisma from "../models/prisma";
import { Request } from 'express';
import AzureService from "./AzureService";

class PostService {
    public postValidation(req: Request) {
        const { content, poll } = req.body;
        if (!content) throw new Error('Treść posta jest wymagana', { cause: 'VALIDATION' });
        if (content.length > 500) throw new Error('Treść posta może mieć maksymalnie 500 znaków', { cause: 'VALIDATION' });
        if (poll) {
            let pollJSON;
            try {
                pollJSON = JSON.parse(poll);
            } catch (err) {
                throw new Error('Ankieta ma niepoprawną strukturę', { cause: 'VALIDATION' });
            }
            if (!Array.isArray(pollJSON)) throw new Error('Ankieta ma niepoprawną strukturę', { cause: 'VALIDATION' });
            const pollArray = pollJSON as string[];
            pollArray.forEach(option => {
                if (option.length > 20) throw new Error('Pole ankiety może mieć maksymalnie 20 znaków', { cause: 'VALIDATION' });
            });
        }
        let video;
        if (req.files && typeof req.files === 'object' && 'video' in req.files) {
            video = req.files['video'][0] as Express.Multer.File;
        }
        let images: Express.Multer.File[] = [];
        if (req.files && typeof req.files === 'object' && 'images' in req.files) {
            images = req.files['images'];
        }
        if (video && images.length > 0) throw new Error('Post nie może mieć filmu i zdjęć naraz', { cause: 'VALIDATION' });
        if (video && video.size > 512 * 1024 * 1024) throw new Error('Film może mieć maksymalnie 512MB', { cause: 'VALIDATION' });
        if (images.length > 0) {
            images.forEach(image => {
                if (image.size > 4 * 1024 * 1024) throw new Error('Każdy obraz może mieć maksymalnie 4MB', { cause: 'VALIDATION' });
            });
        }
        return {
            content,
            video,
            images,
            poll: poll ? JSON.parse(poll) as string[] : []
        }
    }

    public async createPostImage(path: string, postId: string) {
        return await prisma.postImage.create({ data: { path, postId } });
    }

    public async createPostPoll(postId: string) {
        return await prisma.postPoll.create({ data: { postId } });
    }

    public async createPostPollOption(label: string, pollId: string) {
        return await prisma.postPollOption.create({ data: { label, pollId } });
    }

    public async createPost(content: string, userId: string, videoPath?: string) {
        return await prisma.post.create({ data: { content, videoPath, userId } });
    }

    public async getPost(id: string) {
        const post = await prisma.post.findUnique({ where: { id }, include: { images: true, poll: { include: { options: { include: { votes: true } } } }, user: { select: { id: true, username: true, slug: true, avatar: true } } } });
        if (!post) return null;
        if (post.videoPath) {
            post.videoPath = await AzureService.getAzureObject(`postVideos/${post.videoPath}`, 10);
        }
        if (post.images.length > 0) {
            post.images = await Promise.all(post.images.map(async image => {
                const url = await AzureService.getAzureObject(`postImages/${image.path}`, 10);
                return { ...image, path: url };
            }));
        }
        if (post.user.avatar) {
            post.user.avatar = await AzureService.getAzureObject(`pfp/${post.user.avatar}`);
        }
        return post;
    }
}

export default new PostService();