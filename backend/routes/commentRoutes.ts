import { Router } from "express";
import CommentController from "../controllers/CommentController";
import jwtAuthentication from "../middleware/jwtAuthentication";

const router = Router();

router.get('/post-comments/:id', jwtAuthentication, CommentController.postComments);
router.get('/comment-stats/:id', jwtAuthentication, CommentController.commentStats);
router.post('/like-comment/:id', jwtAuthentication, CommentController.like);
router.get('/comment-replies/:id', jwtAuthentication, CommentController.commentReplies);

export default router;