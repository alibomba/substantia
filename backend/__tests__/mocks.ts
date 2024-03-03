import { Post, PostPoll, RefreshToken, User } from "@prisma/client";
import { vi } from "vitest";
import UserService from "../services/UserService";
import AuthService from "../services/AuthService";
import { MyJWTPayload } from "../types";
import GoogleService from "../services/GoogleService";
import { TokenPayload } from "google-auth-library";
import EmailService from "../services/EmailService";
import AzureService from "../services/AzureService";
import PostService from "../services/PostService";
import * as utils from '../utils';
import FileService from "../services/FileService";
import StripeService from "../services/StripeService";

export const mockUser: User = {
    id: '123',
    email: 'test@gmail.com',
    username: 'testuser',
    slug: 'testslug',
    password: 'hashedPassword',
    oAuth: false,
    hasChannel: false,
    stripeChannelPlanID: null,
    stripeCustomerID: null,
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
    stripeChannelPlanID: null,
    stripeCustomerID: null,
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

export const mockCreatePasswordResetToken = vi.spyOn(AuthService, 'createPasswordResetToken');

export const mockSendPasswordResetToken = vi.spyOn(EmailService, 'sendPasswordResetToken');

export const mockVerifyPasswordResetToken = vi.spyOn(AuthService, 'verifyPasswordResetToken');

export const mockUpdateUserPassword = vi.spyOn(UserService, 'updateUserPassword');

export const mockGetAzureObject = vi.spyOn(AzureService, 'getAzureObject');

export const mockPostAzureObject = vi.spyOn(AzureService, 'postAzureObject');

export const mockCreatePost = vi.spyOn(PostService, 'createPost');

export const mockContentOnlyPost: Post = {
    id: '123',
    videoPath: null,
    content: 'test content',
    userId: '123',
    createdAt: new Date()
}

export const mockWithVideoPost: Post = {
    id: '123',
    videoPath: 'uuid',
    content: 'test content',
    userId: '123',
    createdAt: new Date()
}

export const mockGetPost = vi.spyOn(PostService, 'getPost');

export const mockGenerateUniqueId = vi.spyOn(utils, 'generateUniqueId');

export const mockCreatePostImage = vi.spyOn(PostService, 'createPostImage');

export const mockCreatePostPoll = vi.spyOn(PostService, 'createPostPoll');

export const mockPostPoll: PostPoll = {
    id: '123',
    postId: '123',
    createdAt: new Date()
}

export const mockCreatePostPollOption = vi.spyOn(PostService, 'createPostPollOption');

export const mockGetProfilesByPhrase = vi.spyOn(UserService, 'getProfilesByPhrase');

export const mockValidateBannerAspectRatio = vi.spyOn(FileService, 'validateBannerAspectRatio');

export const mockCreateStripeProduct = vi.spyOn(StripeService, 'createStripeProduct');

export const mockCreateChannel = vi.spyOn(UserService, 'createChannel');

export const mockGetUserPlanID = vi.spyOn(UserService, 'getUserPlanID');

export const mockGetUserCustomerID = vi.spyOn(UserService, 'getUserCustomerID');

export const mockCreateStripeCustomer = vi.spyOn(StripeService, 'createStripeCustomer');

export const mockCreateStripeCheckout = vi.spyOn(StripeService, 'createStripeCheckout');

export const mockGetProfilePreview = vi.spyOn(UserService, 'getProfilePreview');

export const mockIsSubscribed = vi.spyOn(StripeService, 'isSubscribed');

export const mockDeleteSubscription = vi.spyOn(StripeService, 'deleteSubscription');

export const mockGetProfileStats = vi.spyOn(UserService, 'getProfileStats');

export const mockProfileSubscriptionCount = vi.spyOn(StripeService, 'profileSubscriptionCount');

export const mockUpdateAvatar = vi.spyOn(UserService, 'updateAvatar');

export const mockUpdateBanner = vi.spyOn(UserService, 'updateBanner');

export const mockUpdateProfileVideo = vi.spyOn(UserService, 'updateProfileVideo');

export const mockGetUserSettings = vi.spyOn(UserService, 'getUserSettings');

export const mockSettings = {
    avatar: 'https://azure.com/pfp.jpg',
    banner: 'https://azure.com/banner.jpg',
    hasChannel: true,
    username: 'TestUser',
    slug: 'testuser',
    facebook: null,
    instagram: '#',
    twitter: '#',
    description: 'test profile description',
    email: 'test@gmail.com'
}