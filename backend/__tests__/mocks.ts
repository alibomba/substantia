import { RefreshToken, User } from "@prisma/client";
import { vi } from "vitest";
import UserService from "../services/UserService";
import AuthService from "../services/AuthService";
import { MyJWTPayload } from "../types";

export const mockUser: User = {
    id: '123',
    email: 'test@gmail.com',
    username: 'testuser',
    slug: 'testslug',
    password: 'hashedPassword',
    oAuth: false,
    hasChannel: false,
    subscriptionPrice: null,
    avatar: null,
    banner: null,
    profileVideo: null,
    facebook: null,
    instagram: null,
    twitter: null,
    description: null,
    createdAt: new Date()
}

export const mockFindUserByEmail = vi.spyOn(UserService, 'findUserByEmail');

export const mockFindUserBySlug = vi.spyOn(UserService, 'findUserBySlug');

export const mockHashPassword = vi.spyOn(AuthService, 'hashPassword');

export const mockCreateUser = vi.spyOn(UserService, 'createUser');

export const mockVerifyPassword = vi.spyOn(AuthService, 'verifyPassword');

export const mockSignToken = vi.spyOn(AuthService, 'signToken');

export const mockSaveToken = vi.spyOn(AuthService, 'saveToken');

export const mockVerifyToken = vi.spyOn(AuthService, 'verifyToken');

export const mockPayload: MyJWTPayload = { id: '123', email: 'test@gmail.com', username: 'testuser', slug: 'testslug', avatar: null, hasChannel: false };

export const mockFindToken = vi.spyOn(AuthService, 'findToken');

export const mockRefreshToken: RefreshToken = { id: '123', token: 'token', issuedAt: new Date() };

export const mockDeleteToken = vi.spyOn(AuthService, 'deleteToken');