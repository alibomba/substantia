import { Router } from 'express';
import UserController from '../controllers/UserController';
import jwtAuthentication from '../middleware/jwtAuthentication';
import optionalJwtAuthentication from '../middleware/optionalJwtAuthentication';

const router = Router();

router.post('/register', UserController.register);
router.get('/search', jwtAuthentication, UserController.profileSearch);
router.post('/create-channel', jwtAuthentication, UserController.createChannel);
router.post('/subscribe/:id', jwtAuthentication, UserController.subscribe);
router.delete('/unsubscribe/:id', jwtAuthentication, UserController.unsubscribe);
router.get('/profile-preview/:id', optionalJwtAuthentication, UserController.profilePreview);

export default router;