import { Request, Response } from 'express';
import PostService from '../services/PostService';
import postUpload from '../middleware/postUpload';
import { MulterError } from 'multer';
import AzureService from '../services/AzureService';
import { generateUniqueId } from '../utils';
import StripeService from '../services/StripeService';
import UserService from '../services/UserService';


class PostController {
    public async createPost(req: Request, res: Response) {
        const { user } = req.body;
        if (!user.hasChannel) return res.status(403).json({ message: 'Nie możesz publikować postów bez kanału' });
        postUpload(req, res, async err => {
            if (err) {
                if (err instanceof MulterError) {
                    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                        if (err.field === 'video') {
                            return res.status(422).json({ message: 'Wybierz poprawny plik wideo' });
                        } else if (err.field === 'images') {
                            return res.status(422).json({ message: 'Wybierz poprawne pliki obrazów' });
                        }
                    }
                    else {
                        return res.sendStatus(500);
                    }
                }
                else {
                    return res.sendStatus(500);
                }
            }

            let params;
            try {
                params = PostService.postValidation(req);
            } catch (exception) {
                const error = exception as Error;
                if (error.cause === 'VALIDATION') {
                    return res.status(422).json({ message: error.message });
                }
                else {
                    return res.sendStatus(500);
                }
            }

            let videoPath;
            if (params.video) {
                videoPath = generateUniqueId();
                await AzureService.postAzureObject(params.video.buffer, `postVideos/${videoPath}`, params.video.mimetype);
            }

            let newPost;
            try {
                newPost = await PostService.createPost(params.content, user.id, videoPath);
            } catch (err) {
                return res.sendStatus(500);
            }

            const postId = newPost.id;

            if (params.images.length > 0) {
                await Promise.all(params.images.map(async image => {
                    const imagePath = generateUniqueId();
                    await AzureService.postAzureObject(image.buffer, `postImages/${imagePath}`, image.mimetype);
                    await PostService.createPostImage(imagePath, postId);
                }));
            }

            if (params.poll.length > 0) {
                const newPoll = await PostService.createPostPoll(postId);
                await Promise.all(params.poll.map(async option => {
                    await PostService.createPostPollOption(option, newPoll.id);
                }));
            }

            try {
                const newPost = await PostService.getPost(postId);
                res.status(201).json(newPost);
            } catch (err) {
                res.sendStatus(500);
            }
        });
    }

    public async feed(req: Request, res: Response) {
        let page = req.query.page as string | number;
        if (page) page = +page;
        else page = 1;
        const { user } = req.body;
        const customerID = await UserService.getUserCustomerID(user.id);
        if (!customerID) return res.json({ currentPage: 0, lastPage: 0, data: [] });
        const posts = await PostService.getUserFeed(customerID, page);
        res.json(posts);
    }

    public async vote(req: Request, res: Response) {
        const { id } = req.params;
        const { user } = req.body;
        const option = await PostService.getPostPollOption(id);
        if (!option) return res.status(404).json({ message: 'Ankieta nie istnieje' });
        const customerID = await UserService.getUserCustomerID(user.id);
        if (!customerID) return res.status(403).json({ message: 'Nie subskrybujesz tego profilu' });
        const planID = await UserService.getUserPlanID(option.poll.post.userId) as string;
        if (!planID) return res.status(404).json({ message: 'Użytkownik nie istnieje' });
        const isSubscribed = await StripeService.isSubscribed(customerID, planID);
        if (!isSubscribed) return res.status(403).json({ message: 'Nie subskrybujesz tego profilu' });
        const optionVotes = await PostService.voteOnOption(id, user.id);
        res.json(optionVotes);
    }

    public async getPollVotes(req: Request, res: Response) {
        const { id } = req.params;
        const { user } = req.body;
        const myOption = await PostService.getMyVote(id, user.id);
        if (myOption === null) return res.status(404).json({ message: 'Ankieta nie istnieje' });
        const isSubscribed = await StripeService.isSubscribedToPollOwner(id, user.id);
        if (!isSubscribed) return res.status(403).json({ message: 'Nie subskrybujesz tego profilu' });
        if (myOption === false) return res.json({ selectedOption: null, percentages: [] });
        const percentages = await PostService.voteOnOption(myOption, user.id);
        res.json({ selectedOption: myOption, percentages });
    }

    public async postStats(req: Request, res: Response) {
        const { id } = req.params;
        const { user } = req.body;
        const stats = await PostService.getPostStats(id);
        if (!stats) return res.status(404).json({ message: 'Post nie istnieje' });
        const isSubscribed = await StripeService.isSubscribedToPostOwner(id, user.id);
        if (!isSubscribed) return res.status(403).json({ message: 'Nie subskrybujesz tego profilu' });
        const isLiked = await PostService.isLiked(id, user.id);
        const isBookmarked = await PostService.isBookmarked(id, user.id);
        res.json({
            stats,
            isLiked,
            isBookmarked
        });
    }

    public async likePost(req: Request, res: Response) {
        const { id } = req.params;
        const { user } = req.body;
        if (!await PostService.doesPostExist(id)) return res.status(404).json({ message: 'Post nie istnieje' });
        const isSubscribed = await StripeService.isSubscribedToPostOwner(id, user.id);
        if (!isSubscribed) return res.status(403).json({ message: 'Nie subskrybujesz tego profilu' });
        const isLikedAfter = await PostService.togglePostLike(id, user.id);
        if (isLikedAfter) res.sendStatus(201);
        else res.sendStatus(204);
    }

    public async bookmarkPost(req: Request, res: Response) {
        const { id } = req.params;
        const { user } = req.body;
        if (!await PostService.doesPostExist(id)) return res.status(404).json({ message: 'Post nie istnieje' });
        const isSubscribed = await StripeService.isSubscribedToPostOwner(id, user.id);
        if (!isSubscribed) return res.status(403).json({ message: 'Nie subskrybujesz tego profilu' });
        const isBookmarkedAfter = await PostService.togglePostBookmark(id, user.id);
        if (isBookmarkedAfter) res.sendStatus(201);
        else res.sendStatus(204);
    }

    public async myBookmarks(req: Request, res: Response) {
        const { user } = req.body;
        const bookmarks = await PostService.getUserBookmarks(user.id);
        res.json(bookmarks);
    }

    public async userPosts(req: Request, res: Response) {
        const { id } = req.params;
        const { user } = req.body;
        let page = req.query.page as string | number;
        if (page) page = +page;
        else page = 1;
        const customerID = await UserService.getUserCustomerID(user.id);
        if (!customerID) return res.status(403).json({ message: 'Nie subskrybujesz tego profilu' });
        const planID = await UserService.getUserPlanID(id);
        if (!planID) return res.status(404).json({ message: 'Profil nie istnieje' });
        const isSubscribed = await StripeService.isSubscribed(customerID, planID);
        if (!isSubscribed) return res.status(403).json({ message: 'Nie subskrybujesz tego profilu' });
        const posts = await PostService.getUserPosts(id, page);
        res.json(posts);
    }
}

export default new PostController();