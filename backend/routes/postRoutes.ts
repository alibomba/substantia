import { Router } from "express";
import PostController from "../controllers/PostController";
import jwtAuthentication from "../middleware/jwtAuthentication";

const router = Router();

router.post('/posts', jwtAuthentication, PostController.createPost);
router.get('/feed', jwtAuthentication, PostController.feed);
router.post('/vote/:id', jwtAuthentication, PostController.vote);
router.get('/poll-votes/:id', jwtAuthentication, PostController.getPollVotes);
router.get('/post-stats/:id', jwtAuthentication, PostController.postStats);
router.post('/like-post/:id', jwtAuthentication, PostController.likePost);
router.post('/bookmark-post/:id', jwtAuthentication, PostController.bookmarkPost);
router.get('/my-bookmarks', jwtAuthentication, PostController.myBookmarks);

export default router;