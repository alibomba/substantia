import prisma from "../models/prisma";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MyJWTPayload } from "../types";
class AuthService {
    public async hashPassword(password: string) {
        return await bcrypt.hash(password, 10);
    }

    public async verifyPassword(password: string, hash: string) {
        if (await bcrypt.compare(password, hash)) return true;
        else return false;
    }

    public signToken(payload: MyJWTPayload, type: 'access' | 'refresh') {
        let token = '';
        if (type === 'access') {
            token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_TTL });
        }
        else if (type === 'refresh') {
            token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string);
        }
        return token;
    }

    public async verifyToken(token: string, type: 'access' | 'refresh') {
        let secret = '';
        switch (type) {
            case 'access':
                secret = process.env.JWT_SECRET as string;
                break;
            case 'refresh':
                secret = process.env.JWT_REFRESH_SECRET as string;
                break;
        }
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, payload) => {
                if (err) reject(err);
                resolve(payload);
            });
        });
    }

    public async saveToken(token: string) {
        await prisma.refreshToken.create({ data: { token } });
    }

    public async findToken(token: string) {
        return await prisma.refreshToken.findUnique({ where: { token } });
    }

    public async deleteToken(token: string) {
        await prisma.refreshToken.delete({ where: { token } });
    }

    public async createPasswordResetToken(email: string) {
        const payload = { email };
        const token = jwt.sign(payload, process.env.PASSWORD_RESET_JWT_SECRET as string, { expiresIn: '15m' });
        await prisma.passwordResetToken.create({ data: { token } });
        return token;
    }

    public async verifyPasswordResetToken(token: string) {
        const tokenDB = await prisma.passwordResetToken.findUnique({ where: { token } });
        if (!tokenDB) throw { message: 'Token nieprawidłowy' };
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.PASSWORD_RESET_JWT_SECRET as string, (err, payload) => {
                if (err) reject(err);
                resolve(payload);
            });
        });
    }
}

export default new AuthService();