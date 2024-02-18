import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';
import { MyJWTPayload } from '../types';

class AuthController {
    public async login(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) return res.status(401).json({ message: 'Niepoprawny e-mail lub hasło' });
        const userFound = await UserService.findUserByEmail(email);
        if (!userFound) return res.status(401).json({ message: 'Niepoprawny e-mail lub hasło' });
        if (userFound.oAuth) return res.status(401).json({ message: 'Zaloguj się za pomocą Google' });
        if (!await AuthService.verifyPassword(password, userFound.password as string)) return res.status(401).json({ message: 'Niepoprawny e-mail lub hasło' });
        const payload: MyJWTPayload = { id: userFound.id, email: userFound.email, username: userFound.username, slug: userFound.slug, avatar: userFound.avatar, hasChannel: userFound.hasChannel };
        const accessToken = AuthService.signToken(payload, 'access');
        const refreshToken = AuthService.signToken(payload, 'refresh');
        try {
            await AuthService.saveToken(refreshToken);
            res.json({ accessToken, refreshToken });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    public getAuth(req: Request, res: Response) {
        const { user } = req.body;
        res.json(user);
    }

    public async refresh(req: Request, res: Response) {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: 'Nie znaleziono tokena' });
        const tokenDB = await AuthService.findToken(refreshToken);
        if (!tokenDB) return res.status(401).json({ message: 'Token nieprawidłowy' });
        let oldPayload;
        try {
            oldPayload = await AuthService.verifyToken(refreshToken, 'refresh') as MyJWTPayload;
        } catch (err) {
            return res.status(401).json({ message: 'Token nieprawidłowy' });
        }
        const newPayload: MyJWTPayload = { id: oldPayload.id, email: oldPayload.email, username: oldPayload.username, slug: oldPayload.slug, avatar: oldPayload.avatar, hasChannel: oldPayload.hasChannel };
        const newToken = AuthService.signToken(newPayload, 'access');
        res.json({ accessToken: newToken });
    }

    public async logout(req: Request, res: Response) {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: 'Nie znaleziono tokena' });
        const tokenDB = await AuthService.findToken(refreshToken);
        if (!tokenDB) return res.status(401).json({ message: 'Token nieprawidłowy' });
        try {
            await AuthService.verifyToken(refreshToken, 'refresh');
        } catch (err) {
            return res.status(401).json({ message: 'Token nieprawidłowy' });
        }
        try {
            await AuthService.deleteToken(refreshToken);
            res.sendStatus(204);
        } catch (err) {
            res.sendStatus(500);
        }
    }
}

export default new AuthController();