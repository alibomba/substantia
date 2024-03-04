import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';
import GoogleService from '../services/GoogleService';
import { MyJWTPayload } from '../types';
import { generateUniqueSlug, generateUsername } from '../utils'
import EmailService from '../services/EmailService';
import AzureService from '../services/AzureService';

class AuthController {
    public async login(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) return res.status(401).json({ message: 'Niepoprawny e-mail lub hasło' });
        const userFound = await UserService.findUserByEmail(email);
        if (!userFound) return res.status(401).json({ message: 'Niepoprawny e-mail lub hasło' });
        if (userFound.oAuth) return res.status(401).json({ message: 'Zaloguj się za pomocą Google' });
        if (!await AuthService.verifyPassword(password, userFound.password as string)) return res.status(401).json({ message: 'Niepoprawny e-mail lub hasło' });
        let avatar;
        if (userFound.avatar) {
            avatar = await AzureService.getAzureObject(`pfp/${userFound.avatar}`);
        }
        else {
            avatar = userFound.avatar;
        }
        const payload: MyJWTPayload = { id: userFound.id, email: userFound.email, username: userFound.username, slug: userFound.slug, avatar, hasChannel: userFound.hasChannel };
        const accessToken = AuthService.signToken(payload, 'access');
        const refreshToken = AuthService.signToken(payload, 'refresh');
        try {
            await AuthService.saveToken(refreshToken);
            res.json({ accessToken, refreshToken, payload });
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
        const user = await UserService.findUserById(oldPayload.id);
        if (!user) return res.status(401).json({ message: 'Użytkownik nie istnieje' });
        if (user.avatar) user.avatar = await AzureService.getAzureObject(`pfp/${user.avatar}`);
        const newPayload: MyJWTPayload = { id: user.id, email: user.email, username: user.username, slug: user.slug, avatar: user.avatar, hasChannel: user.hasChannel };
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

    public async googleLogin(req: Request, res: Response) {
        const { token } = req.body;
        if (!token) return res.status(401).json({ message: 'Token jest wymagany' });
        let googleUser;
        try {
            googleUser = await GoogleService.getGoogleUser(token);
        } catch (exception) {
            const error = exception as Error;
            if (error.cause === 'AUTHORIZATION') {
                return res.status(401).json({ message: error.message });
            }
            else {
                return res.sendStatus(500);
            }
        }
        if (!googleUser.email) return res.status(422).json({ message: 'Adres e-mail jest wymagany' });
        const userFound = await UserService.findUserByEmail(googleUser.email);
        if (userFound && userFound.oAuth) {
            let avatar;
            if (userFound.avatar) {
                avatar = await AzureService.getAzureObject(`pfp/${userFound.avatar}`);
            }
            else {
                avatar = userFound.avatar;
            }
            const payload: MyJWTPayload = { id: userFound.id, email: userFound.email, username: userFound.username, slug: userFound.slug, avatar, hasChannel: userFound.hasChannel };
            const accessToken = AuthService.signToken(payload, 'access');
            const refreshToken = AuthService.signToken(payload, 'refresh');
            try {
                await AuthService.saveToken(refreshToken);
                res.json({ accessToken, refreshToken, payload });
            } catch (err) {
                res.sendStatus(500);
            }
        }
        else if (!userFound) {
            const username = generateUsername(googleUser.email);
            const slug = await generateUniqueSlug(googleUser.email);
            const newUser = await UserService.createOAuthUser(googleUser.email, username, slug);
            const payload: MyJWTPayload = { id: newUser.id, email: newUser.email, username: newUser.username, slug: newUser.slug, avatar: newUser.avatar, hasChannel: newUser.hasChannel };
            const accessToken = AuthService.signToken(payload, 'access');
            const refreshToken = AuthService.signToken(payload, 'refresh');
            try {
                await AuthService.saveToken(refreshToken);
                res.status(201).json({ accessToken, refreshToken, payload });
            } catch (err) {
                res.sendStatus(500);
            }
        }
        else if (userFound && !userFound.oAuth) {
            return res.status(422).json({ message: 'Adres e-mail jest już zajęty' });
        }
    }

    public async passwordResetRequest(req: Request, res: Response) {
        const { email } = req.body;
        if (!email) return res.status(422).json({ message: 'Adres e-mail jest wymagany' });
        const user = await UserService.findUserByEmail(email);
        if (!user) return res.status(422).json({ message: 'Użytkownik o podanym adresie e-mail nie istnieje' });
        if (user.oAuth) return res.status(422).json({ message: 'Użytkownik nie posiada hasła, zaloguj się za pomocą Google' });
        const token = await AuthService.createPasswordResetToken(email);
        try {
            await EmailService.sendPasswordResetToken(email, token);
            res.sendStatus(204);
        } catch (err) {
            res.sendStatus(500);
        }
    }

    public async passwordReset(req: Request, res: Response) {
        const { token } = req.params;
        const { newPassword } = req.body;
        if (!newPassword) return res.status(422).json({ message: 'Hasło jest wymagane' });
        let email;
        try {
            const payload = await AuthService.verifyPasswordResetToken(token) as { email: string };
            email = payload.email;
        } catch (err) {
            return res.status(401).json({ message: 'Token nieprawidłowy' });
        }
        const userFound = await UserService.findUserByEmail(email);
        if (!userFound) return res.status(401).json({ message: 'Użytkownik nie istnieje' });
        const passwordHash = await AuthService.hashPassword(newPassword);
        try {
            await UserService.updateUserPassword(userFound.id, passwordHash);
            res.sendStatus(204);
        } catch (err) {
            res.sendStatus(500);
        }
    }
}

export default new AuthController();