import { RefreshToken, User } from "@prisma/client";
import { vi } from "vitest";
import UserService from "../services/UserService";
import AuthService from "../services/AuthService";
import { MyJWTPayload } from "../types";
import GoogleService from "../services/GoogleService";
import { TokenPayload } from "google-auth-library";

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

export const mockGetGoogleUser = vi.spyOn(GoogleService, 'getGoogleUser');

export const mockGoogleUserPayload: TokenPayload = { aud: '', exp: 123, iat: 123, iss: '', sub: '', email: 'test@gmail.com' };

export const mockGoogleUserPayloadNoEmail: TokenPayload = { aud: '', exp: 123, iat: 123, iss: '', sub: '' };

export const mockCreateOAuthUser = vi.spyOn(UserService, 'createOAuthUser');

export const mockOAuthUser: User = {
    id: '123',
    email: 'test@gmail.com',
    username: 'test',
    slug: 'test',
    password: null,
    oAuth: true,
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