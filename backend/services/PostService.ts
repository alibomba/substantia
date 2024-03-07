import prisma from "../models/prisma";
import { Request } from 'express';
import AzureService from "./AzureService";
import StripeService from "./StripeService";
import calculatePercentage from "../utils/calculatePercentage";

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

    public async doesPostExist(id: string) {
        const post = await prisma.post.findUnique({ where: { id } });
        if (post) return true;
        else return false;
    }

    public async getUserFeed(customerID: string, page: number) {
        const PER_PAGE = 10;
        const userSubscribedPlans = await StripeService.userSubscriptionPlansList(customerID);
        const postCount = await prisma.post.count({ where: { user: { stripeChannelPlanID: { in: userSubscribedPlans } } } });
        if (!postCount) return { currentPage: 0, lastPage: 0, data: [] };
        const lastPage = Math.ceil(postCount / PER_PAGE);
        if (page > lastPage) return { lastPage, currentPage: lastPage, data: [] };
        const offset = (page - 1) * PER_PAGE;
        const postIds = await prisma.post.findMany({
            where: {
                user: { stripeChannelPlanID: { in: userSubscribedPlans } }
            },
            take: PER_PAGE,
            skip: offset,
            select: { id: true },
            orderBy: { createdAt: 'desc' }
        });
        const posts = await Promise.all(postIds.map(async item => {
            const id = item.id;
            return await this.getPost(id);
        }));
        return {
            currentPage: page,
            lastPage,
            data: posts
        }
    }

    public async getPostPollOption(id: string) {
        return await prisma.postPollOption.findUnique({ where: { id }, select: { poll: { select: { post: { select: { userId: true } } } } } });
    }

    public async voteOnOption(id: string, userID: string) {
        const result = await prisma.postPollOption.findUnique({ where: { id }, select: { poll: { select: { options: true } } } });
        const optionIds = result!.poll.options.map(option => option.id);
        const me = await prisma.user.findUnique({
            where: { id: userID },
            select: {
                pollVotes: {
                    where: {
                        id: { in: optionIds }
                    }
                }
            }
        });
        if (me!.pollVotes.length) {
            const votedID = me!.pollVotes[0].id;
            await prisma.user.update({ where: { id: userID }, data: { pollVotes: { disconnect: { id: votedID } } } });
        }
        await prisma.user.update({ where: { id: userID }, data: { pollVotes: { connect: { id } } } });
        const allVotes = await prisma.postPollOption.findMany({ where: { id: { in: optionIds } }, select: { id: true, votes: true } });
        const allVotesCount = allVotes.map(item => item.votes).flat().length;
        const percentages = allVotes.map(item => {
            const votes = item.votes;
            const percentage = calculatePercentage(allVotesCount, votes.length);
            return {
                id: item.id,
                percentage
            }
        });
        return percentages;
    }

    public async getMyVote(pollID: string, userID: string) {
        const poll = await prisma.postPoll.findUnique({ where: { id: pollID }, select: { options: { select: { id: true } } } });
        if (!poll) return null;
        const optionIds = poll.options.map(option => option.id);
        const me = await prisma.user.findUnique({
            where: { id: userID },
            select: {
                pollVotes: {
                    where: { id: { in: optionIds } }
                }
            }
        });
        if (me!.pollVotes.length) {
            return me!.pollVotes[0].id;
        }
        else {
            return false;
        }
    }

    public async getPostStats(id: string) {
        const post = await prisma.post.findUnique({
            where: { id },
            select: {
                likes: true,
                comments: true
            }
        });
        if (!post) return null;
        return {
            likes: post.likes.length,
            comments: post.comments.length,
        }
    }

    public async isLiked(id: string, userId: string) {
        const like = await prisma.postLike.findFirst({ where: { postId: id, userId } });
        if (like) return true;
        else return false;
    }

    public async isBookmarked(id: string, userId: string) {
        const bookmark = await prisma.bookmark.findFirst({ where: { postId: id, userId } });
        if (bookmark) return true;
        else return false;
    }

    public async togglePostLike(id: string, userId: string) {
        const like = await prisma.postLike.findFirst({ where: { postId: id, userId } });
        if (like) {
            await prisma.postLike.delete({ where: { id: like.id } });
            return false;
        } else {
            await prisma.postLike.create({ data: { postId: id, userId } });
            return true;
        }
    }

    public async togglePostBookmark(id: string, userId: string) {
        const bookmark = await prisma.bookmark.findFirst({ where: { postId: id, userId } });
        if (bookmark) {
            await prisma.bookmark.delete({ where: { id: bookmark.id } });
            return false;
        } else {
            await prisma.bookmark.create({ data: { postId: id, userId } });
            return true;
        }
    }

    public async getUserBookmarks(id: string) {
        const bookmarks = await prisma.bookmark.findMany({ where: { userId: id }, select: { post: { select: { id: true } } } });
        return await Promise.all(bookmarks.map(async bookmark => await this.getPost(bookmark.post.id)));
    }

    public async getUserPosts(id: string, page: number) {
        const PER_PAGE = 10;
        const postCount = await prisma.post.count({ where: { userId: id } });
        if (!postCount) return { currentPage: 0, lastPage: 0, data: [] };
        const lastPage = Math.ceil(postCount / PER_PAGE);
        if (page > lastPage) return { lastPage, currentPage: lastPage, data: [] };
        const offset = (page - 1) * PER_PAGE;
        const postIds = await prisma.post.findMany({
            where: { userId: id },
            take: PER_PAGE,
            skip: offset,
            select: { id: true },
            orderBy: { createdAt: 'desc' }
        });
        const posts = await Promise.all(postIds.map(async item => {
            const id = item.id;
            return await this.getPost(id);
        }));
        return {
            currentPage: page,
            lastPage,
            data: posts
        }
    }

    public async isPollOptionMine(id: string, userId: string) {
        const pollOption = await prisma.postPollOption.findUnique({ where: { id }, select: { poll: { select: { post: { select: { userId: true } } } } } });
        return pollOption!.poll.post.userId === userId;
    }

    public async isPollMine(id: string, userId: string) {
        const poll = await prisma.postPoll.findUnique({ where: { id }, select: { post: { select: { userId: true } } } });
        return poll!.post.userId === userId;
    }

    public async isPostMine(id: string, userId: string) {
        const post = await prisma.post.findUnique({ where: { id }, select: { userId: true } });
        return post!.userId === userId;
    }

    public async isCommentedPostMine(id: string, userId: string) {
        const comment = await prisma.postComment.findUnique({ where: { id }, select: { post: { select: { userId: true } } } });
        return comment!.post.userId === userId;
    }
}

export default new PostService();