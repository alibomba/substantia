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

    public async like(req: Request, res: Response) {
        const { id } = req.params;
        const { user } = req.body;
        if (!await CommentService.doesCommentExist(id)) return res.status(404).json({ message: 'Komentarz nie istnieje' });
        const isSubscribed = await StripeService.isSubscribedToCommentedPostOwner(id, user.id);
        const isPostMine = await PostService.isCommentedPostMine(id, user.id);
        if (!isSubscribed && !isPostMine) return res.status(403).json({ message: 'Nie subskrybujesz tego profilu' });
        const isLikedAfter = await CommentService.toggleLike(id, user.id);
        if (isLikedAfter) res.sendStatus(201);
        else res.sendStatus(204);
    }

    public async commentReplies(req: Request, res: Response) {
        const { id } = req.params;
        const { user } = req.body;
        if (!await CommentService.doesCommentExist(id)) return res.status(404).json({ message: 'Komentarz nie istnieje' });
        const isSubscribed = await StripeService.isSubscribedToCommentedPostOwner(id, user.id);
        const isPostMine = await PostService.isCommentedPostMine(id, user.id);
        if (!isSubscribed && !isPostMine) return res.status(403).json({ message: 'Nie subskrybujesz tego profilu' });
        const replies = await CommentService.getCommentReplies(id);
        res.json(replies);
    }

    public async likeReply(req: Request, res: Response) {
        const { id } = req.params;
        const { user } = req.body;
        if (!await CommentService.doesReplyExist(id)) return res.status(404).json({ message: 'Odpowiedź nie istnieje' });
        const isSubscribed = await StripeService.isSubscribedToRepliedPostOwner(id, user.id);
        const isPostMine = await PostService.isRepliedPostMine(id, user.id);
        if (!isSubscribed && !isPostMine) return res.status(403).json({ message: 'Nie subskrybujesz tego profilu' });
        const isLikedAfter = await CommentService.toggleReplyLike(id, user.id);
        if (isLikedAfter) res.sendStatus(201);
        else res.sendStatus(204);
    }

    public async createComment(req: Request, res: Response) {
        const { id } = req.params;
        const { user, content } = req.body;
        if (!await PostService.doesPostExist(id)) return res.status(404).json({ message: 'Post nie istnieje' });
        const isSubscribed = await StripeService.isSubscribedToPostOwner(id, user.id);
        const isPostMine = await PostService.isPostMine(id, user.id);
        if (!isSubscribed && !isPostMine) return res.status(403).json({ message: 'Nie subskrybujesz tego profilu' });
        if (!content) return res.status(422).json({ message: 'Treść komentarza jest wymagana' });
        if (content.length > 400) return res.status(422).json({ message: 'Treść komentarza może mieć maksymalnie 400 znaków' });
        const comment = await CommentService.createComment(content, id, user.id);
        res.status(201).json(comment);
    }

    public async createReply(req: Request, res: Response) {
        const { id } = req.params;
        const { user, content } = req.body;
        if (!await CommentService.doesCommentExist(id)) return res.status(404).json({ message: 'Komentarz nie istnieje' });
        const isSubscribed = await StripeService.isSubscribedToCommentedPostOwner(id, user.id);
        const isPostMine = await PostService.isCommentedPostMine(id, user.id);
        if (!isSubscribed && !isPostMine) return res.status(403).json({ message: 'Nie subskrybujesz tego profilu' });
        if (!content) return res.status(422).json({ message: 'Treść odpowiedzi jest wymagana' });
        if (content.length > 400) return res.status(422).json({ message: 'Treść odpowiedzi może mieć maksymalnie 400 znaków' });
        const reply = await CommentService.createReply(content, id, user.id);
        res.status(201).json(reply);
    }

    public async isReplyLiked(req: Request, res: Response) {
        const { id } = req.params;
        const { user } = req.body;
        if (!await CommentService.doesReplyExist(id)) return res.status(404).json({ message: 'Odpowiedź nie istnieje' });
        const isSubscribed = await StripeService.isSubscribedToRepliedPostOwner(id, user.id);
        const isPostMine = await PostService.isRepliedPostMine(id, user.id);
        if (!isSubscribed && !isPostMine) return res.status(403).json({ message: 'Nie subskrybujesz tego profilu' });
        const isLiked = await CommentService.isReplyLiked(id, user.id);
        res.json({ isLiked });
    }
}

export default new CommentController();