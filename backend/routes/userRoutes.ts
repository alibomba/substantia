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
router.get('/profile-stats/:id', UserController.profileStats);
router.put('/update-avatar', jwtAuthentication, UserController.updateAvatar);
router.put('/update-banner', jwtAuthentication, UserController.updateBanner);
router.put('/update-profile-video', jwtAuthentication, UserController.updateProfileVideo);
router.get('/my-settings', jwtAuthentication, UserController.getMySettings);
router.put('/update-settings', jwtAuthentication, UserController.updateSettings);
router.get('/check-oauth', jwtAuthentication, UserController.checkOAuth);

export default router;