import { Request, Response } from 'express';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';

class UserController {
    public async register(req: Request, res: Response) {
        const { email, username, slug, password } = req.body;
        try {
            await UserService.registerValidation(email, username, slug, password);
        } catch (exception) {
            const error = exception as Error;
            if (error.cause === 'VALIDATION') {
                return res.status(422).json({ message: error.message });
            }
            else {
                return res.sendStatus(500);
            }
        }
        const passwordHash = await AuthService.hashPassword(password);
        try {
            const newUser = await UserService.createUser(email, username, slug, passwordHash);
            res.status(201).json({ ...newUser, password: undefined });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    public async profileSearch(req: Request, res: Response) {
        const { phrase } = req.query;
        if (!phrase) return res.status(422).json({ message: 'Fraza jest wymagana' });
        const profiles = await UserService.getProfilesByPhrase(phrase as string);
        res.json(profiles);
    }
}

export default new UserController();