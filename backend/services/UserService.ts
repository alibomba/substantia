import { Request } from "express";
import prisma from "../models/prisma";
import AzureService from "./AzureService";
import FileService from "./FileService";
import AuthService from "./AuthService";


class UserService {
    public async findUserByEmail(email: string) {
        return await prisma.user.findUnique({ where: { email } });
    }

    public async findUserBySlug(slug: string) {
        return await prisma.user.findUnique({ where: { slug } });
    }

    public async findUserById(id: string) {
        return await prisma.user.findUnique({ where: { id } });
    }

    public async registerValidation(email: string, username: string, slug: string, password: string) {
        if (!email) throw new Error('Adres e-mail jest wymagany', { cause: 'VALIDATION' });
        if (email.length > 20) throw new Error('Adres może mieć maksymalnie 20 znaków', { cause: 'VALIDATION' });
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        if (!email.match(emailRegex)) throw new Error('Podaj poprawny adres e-mail', { cause: 'VALIDATION' });
        const emailFound = await this.findUserByEmail(email);
        if (emailFound) throw new Error('Adres e-mail jest już zajęty', { cause: 'VALIDATION' });
        if (!username) throw new Error('Nazwa użytkownika jest wymagana', { cause: 'VALIDATION' });
        if (username.length > 20) throw new Error('Nazwa użytkownika może mieć maksymalnie 20 znaków', { cause: 'VALIDATION' });
        if (!slug) throw new Error('Identyfikator jest wymagany', { cause: 'VALIDATION' });
        if (slug.length > 20) throw new Error('Identyfikator może mieć maksymalnie 20 znaków', { cause: 'VALIDATION' });
        const slugRegex = /^[a-z0-9]+$/;
        if (!slug.match(slugRegex)) throw new Error('Identyfikator może mieć tylko małe litery i cyfry', { cause: 'VALIDATION' });
        const slugFound = await this.findUserBySlug(slug);
        if (slugFound) throw new Error('Identyfikator jest już zajęty', { cause: 'VALIDATION' });
        if (!password) throw new Error('Hasło jest wymagane', { cause: 'VALIDATION' });
        if (password.length < 8 || password.length > 60) throw new Error('Hasło musi mieć pomiędzy 8 a 60 znaków', { cause: 'VALIDATION' });
    }

    public async createUser(email: string, username: string, slug: string, password: string) {
        return await prisma.user.create({ data: { email, username, slug, password, oAuth: false } });
    }

    public async getExistingSlugs() {
        const users = await prisma.user.findMany({ select: { slug: true } });
        return users.map(user => user.slug);
    }

    public async createOAuthUser(email: string, username: string, slug: string) {
        return await prisma.user.create({ data: { email, username, slug, oAuth: true } });
    }

    public async updateUserPassword(id: string, password: string) {
        return await prisma.user.update({ where: { id }, data: { password } });
    }

    public async getProfilesByPhrase(phrase: string) {
        const profiles = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        username: { contains: phrase }
                    },
                    {
                        slug: { contains: phrase }
                    },
                    {
                        description: { contains: phrase }
                    }
                ],
                hasChannel: true
            },
            select: {
                id: true,
                avatar: true,
                username: true,
                slug: true,
                description: true
            }
        });
        return await Promise.all(profiles.map(async profile => {
            if (profile.avatar) {
                profile.avatar = await AzureService.getAzureObject(`pfp/${profile.avatar}`);
            }
            return profile;
        }));
    }

    public async validateChannel(req: Request) {
        const { description, subscriptionPrice } = req.body;
        if (!description) throw new Error('Opis jest wymagany', { cause: 'VALIDATION' });
        if (description.length > 200) throw new Error('Opis może mieć maksymalnie 200 znaków', { cause: 'VALIDATION' });
        if (!subscriptionPrice) throw new Error('Cena subskrypcji jest wymagana', { cause: 'VALIDATION' });
        const subscriptionPriceFloat = parseFloat(subscriptionPrice);
        if (isNaN(subscriptionPriceFloat)) throw new Error('Podaj poprawną cenę subskrypcji', { cause: 'VALIDATION' });
        if (subscriptionPriceFloat > 200) throw new Error('Maksymalna cena subskrypcji to 200zł', { cause: 'VALIDATION' });
        const subscriptionPriceInCents = parseInt((subscriptionPriceFloat * 100).toFixed(0));

        let banner;
        if (req.files && typeof req.files === 'object' && 'banner' in req.files) {
            banner = req.files['banner'][0];
        }
        if (!banner) throw new Error('Banner jest wymagany', { cause: 'VALIDATION' });
        if (banner.size > 7 * 1024 * 1024) throw new Error('Banner może mieć maksymalnie 7MB', { cause: 'VALIDATION' });
        if (!await FileService.validateBannerAspectRatio(banner.buffer)) throw new Error('Banner musi mieć współczynnik proporcji 5:1', { cause: 'VALIDATION' });

        let profileVideo;
        if (req.files && typeof req.files === 'object' && 'profileVideo' in req.files) {
            profileVideo = req.files['profileVideo'][0];
        }
        if (!profileVideo) throw new Error('Filmik profilowy jest wymagany', { cause: 'VALIDATION' });
        if (profileVideo.size > 100 * 1024 * 1024) throw new Error('Filmik profilowy może mieć maksymalnie 100MB', { cause: 'VALIDATION' });
        return {
            banner,
            profileVideo,
            description,
            subscriptionPriceInCents
        }
    }

    public async createChannel(userId: string, banner: string, profileVideo: string, description: string, stripeProductID: string, subscriptionPrice: number) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                hasChannel: true,
                banner,
                profileVideo,
                description,
                stripeChannelPlanID: stripeProductID,
                subscriptionPrice
            }
        });
    }

    public async getUserPlanID(id: string) {
        const user = await prisma.user.findUnique({ where: { id }, select: { stripeChannelPlanID: true } });
        return user?.stripeChannelPlanID;
    }

    public async getUserCustomerID(id: string) {
        const user = await prisma.user.findUnique({ where: { id }, select: { stripeCustomerID: true } });
        return user?.stripeCustomerID;
    }

    public async getProfilePreview(id: string) {
        return await prisma.user.findUnique({
            where: { id }, select: {
                id: true,
                banner: true,
                avatar: true,
                facebook: true,
                instagram: true,
                twitter: true,
                username: true,
                slug: true,
                description: true,
                subscriptionPrice: true,
                profileVideo: true
            }
        });
    }

    public async getProfileStats(id: string) {
        const profile = await prisma.user.findUnique({ where: { id }, select: { hasChannel: true, posts: { select: { likes: true } } } });
        if (!profile || !profile.hasChannel) return null;
        const posts = profile.posts.length;
        const likes = profile.posts.reduce((total, post) => total + post.likes.length, 0);
        return { posts, likes };
    }

    public async updateAvatar(id: string, path: string) {
        return await prisma.user.update({ where: { id }, data: { avatar: path } });
    }

    public async updateBanner(id: string, path: string) {
        return await prisma.user.update({ where: { id }, data: { banner: path } });
    }

    public async updateProfileVideo(id: string, path: string) {
        return await prisma.user.update({ where: { id }, data: { profileVideo: path } });
    }

    public async getUserSettings(id: string) {
        const settings = await prisma.user.findUnique({
            where: { id }, select: {
                avatar: true,
                banner: true,
                hasChannel: true,
                username: true,
                slug: true,
                facebook: true,
                instagram: true,
                twitter: true,
                description: true,
                email: true
            }
        });
        if (!settings) return null;
        if (settings.avatar) settings.avatar = await AzureService.getAzureObject(`pfp/${settings.avatar}`, 5);
        if (settings.banner) settings.banner = await AzureService.getAzureObject(`banners/${settings.banner}`, 5);
        return settings;
    }

    public async validateSettings(req: Request, myID: string) {
        const { username, slug, facebook, instagram, twitter, description, email, password, oldPassword } = req.body;
        //first form
        if (username || slug) {
            if (!username) throw new Error('Nazwa użytkownika jest wymagana', { cause: 'VALIDATION' });
            if (username.length > 20) throw new Error('Nazwa użytkownika może mieć maksymalnie 20 znaków', { cause: 'VALIDATION' });
            if (!slug) throw new Error('Identyfikator jest wymagany', { cause: 'VALIDATION' });
            if (slug.length > 20) throw new Error('Identyfikator może mieć maksymalnie 20 znaków', { cause: 'VALIDATION' });
            const slugDuplicate = await this.findUserBySlug(slug);
            if (slugDuplicate && slugDuplicate.id !== myID) throw new Error('Identyfikator jest już zajęty', { cause: 'VALIDATION' });
        }
        //socialmedia
        if (facebook && facebook.length > 500) throw new Error('Facebook może mieć maksymalnie 500 znaków', { cause: 'VALIDATION' });
        if (instagram && instagram.length > 500) throw new Error('Instagram może mieć maksymalnie 500 znaków', { cause: 'VALIDATION' });
        if (twitter && twitter.length > 500) throw new Error('Twitter może mieć maksymalnie 500 znaków', { cause: 'VALIDATION' });
        //second form
        if (description && description.length > 200) throw new Error('Opis może mieć maksymalnie 200 znaków', { cause: 'VALIDATION' });
        //third form
        if (email) {
            if (email.length > 20) throw new Error('Adres e-mail może mieć maksymalnie 200 znaków', { cause: 'VALIDATION' });
            const emailDuplicate = await this.findUserByEmail(email);
            if (emailDuplicate && emailDuplicate.id !== myID) throw new Error('Adres e-mail jest już zajęty', { cause: 'VALIDATION' });
        }
        //fourth form
        if (password) {
            if (!oldPassword) throw new Error('Hasło musi mieć pomiędzy 8 a 60 znaków', { cause: 'VALIDATION' });
            const me = await this.findUserById(myID);
            if (!me) throw new Error('Użytkownik nie istnieje', { cause: 'VALIDATION' });
            if (me.oAuth) throw new Error('Użytkownik zarejestrowany z Google nie może zmienić hasła', { cause: 'VALIDATION' });
            if (!await AuthService.verifyPassword(oldPassword, me.password!)) throw new Error('Niepoprawne stare hasło', { cause: 'VALIDATION' });
            if (password.length < 8 || password.length > 60) throw new Error('Hasło musi mieć pomiędzy 8 a 60 znaków', { cause: 'VALIDATION' });
        }
    }

    public async updateSettings(id: string, req: Request, password: string | undefined) {
        const { username, slug, facebook, instagram, twitter, description, email } = req.body;
        return await prisma.user.update({
            where: { id }, data: {
                username: username && username,
                slug: slug && slug,
                facebook: facebook && facebook,
                instagram: instagram && instagram,
                twitter: twitter && twitter,
                description: description && description,
                email: email && email,
                password: password && password
            }
        });
    }
}

export default new UserService();