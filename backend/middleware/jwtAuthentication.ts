import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';
import { MyJWTPayload } from '../types';
import UserService from '../services/UserService';

async function jwtAuthentication(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Nie znaleziono tokena' });
    let payload;
    try {
        payload = await AuthService.verifyToken(token, 'access') as MyJWTPayload;
    } catch (err: any) {
        return res.status(401).json({ message: err.message });
    }
    const userFound = await UserService.findUserByEmail(payload.email);
    if (!userFound) return res.status(401).json({ message: 'Użytkownik nie istnieje' });
    req.body.user = payload;
    next();
}

export default jwtAuthentication;