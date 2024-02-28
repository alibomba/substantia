import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';
import { MyJWTPayload } from '../types';
import UserService from '../services/UserService';

async function optionalJwtAuthentication(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        req.body.user = null;
        next();
        return;
    }
    let payload;
    try {
        payload = await AuthService.verifyToken(token, 'access') as MyJWTPayload;
    } catch (err) {
        req.body.user = null;
        next();
        return;
    }
    const userFound = await UserService.findUserByEmail(payload.email);
    if (!userFound) {
        req.body.user = null;
        next();
        return;
    }
    req.body.user = payload;
    next();
}

export default optionalJwtAuthentication;