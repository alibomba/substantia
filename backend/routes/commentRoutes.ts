import { Router } from "express";
import CommentController from "../controllers/CommentController";
import jwtAuthentication from "../middleware/jwtAuthentication";

const router = Router();

router.get('/post-comments/:id', jwtAuthentication, CommentController.postComments);

export default router;