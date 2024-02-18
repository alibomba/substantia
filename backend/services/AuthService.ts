import prisma from "../models/prisma";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthService {
    public async hashPassword(password: string) {
        return await bcrypt.hash(password, 10);
    }
}

export default new AuthService();