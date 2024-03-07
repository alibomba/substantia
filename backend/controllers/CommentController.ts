import { Request, Response } from 'express';
import CommentService from '../services/CommentService';
import PostService from '../services/PostService';
import UserService from '../services/UserService';
import StripeService from '../services/StripeService';

class CommentController {
    public async postComments(req: Request, res: Response) {
        const { id } = req.params;
        const { user } = req.body;
        let page = req.query.page as string | number;
        if (page) page = +page;
        else page = 1;
        if (!await PostService.doesPostExist(id)) return res.status(404).json({ message: 'Post nie istnieje' });
        const isSubscribed = await StripeService.isSubscribedToPostOwner(id, user.id);
        const isPostMine = await PostService.isPostMine(id, user.id);
        if (!isSubscribed && !isPostMine) return res.status(403).json({ message: 'Nie subskrybujesz tego profilu' });
        const comments = await CommentService.getPostComments(id, page);
        res.json(comments);
    }

    public async commentStats(req: Request, res: Response) {
        const { id } = req.params;
        const { user } = req.body;
        if (!await CommentService.doesCommentExist(id)) return res.status(404).json({ message: 'Komentarz nie istnieje' });
        const isSubscribed = await StripeService.isSubscribedToCommentedPostOwner(id, user.id);
        const isPostMine = await PostService.isCommentedPostMine(id, user.id);
        if (!isSubscribed && !isPostMine) return res.status(403).json({ message: 'Nie subskrybujesz tego profilu' });
        const stats = await CommentService.getCommentStats(id);
        const isLiked = await CommentService.isLiked(id, user.id);
        res.json({
            stats,
            isLiked
        });
    }
}

export default new CommentController();