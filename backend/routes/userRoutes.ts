import { Router } from 'express';
import UserController from '../controllers/UserController';
import jwtAuthentication from '../middleware/jwtAuthentication';

const router = Router();

router.post('/register', UserController.register);
router.get('/search', jwtAuthentication, UserController.profileSearch);

export default router;