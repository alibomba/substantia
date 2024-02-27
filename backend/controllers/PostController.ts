import { Request, Response } from 'express';
import PostService from '../services/PostService';
import postUpload from '../middleware/postUpload';
import { MulterError } from 'multer';
import AzureService from '../services/AzureService';
import { generateUniqueId } from '../utils';


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
}

export default new PostController();