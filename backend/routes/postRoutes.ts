import { Router } from "express";
import PostController from "../controllers/PostController";
import jwtAuthentication from "../middleware/jwtAuthentication";

const router = Router();

router.post('/posts', jwtAuthentication, PostController.createPost);
router.get('/feed', jwtAuthentication, PostController.feed);

export default router;