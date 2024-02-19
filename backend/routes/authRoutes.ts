import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import jwtAuthentication from '../middleware/jwtAuthentication';

const router = Router();

router.post('/login', AuthController.login);
router.get('/auth', jwtAuthentication, AuthController.getAuth);
router.post('/refresh', AuthController.refresh);
router.post('/logout', jwtAuthentication, AuthController.logout);
router.post('/google-login', AuthController.googleLogin);

export default router;