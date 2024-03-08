import { Router } from "express";
import CommentController from "../controllers/CommentController";
import jwtAuthentication from "../middleware/jwtAuthentication";

const router = Router();

router.get('/post-comments/:id', jwtAuthentication, CommentController.postComments);
router.get('/comment-stats/:id', jwtAuthentication, CommentController.commentStats);
router.post('/like-comment/:id', jwtAuthentication, CommentController.like);
router.get('/comment-replies/:id', jwtAuthentication, CommentController.commentReplies);
router.post('/like-reply/:id', jwtAuthentication, CommentController.likeReply);
router.post('/comments/:id', jwtAuthentication, CommentController.createComment);
router.post('/comment-replies/:id', jwtAuthentication, CommentController.createReply);
router.get('/is-reply-liked/:id', jwtAuthentication, CommentController.isReplyLiked);

export default router;