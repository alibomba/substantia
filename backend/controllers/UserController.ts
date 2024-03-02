import { Request, Response } from 'express';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';
import createChannel from '../middleware/createChannel';
import { MulterError } from 'multer';
import { generateUniqueId } from '../utils';
import AzureService from '../services/AzureService';
import StripeService from '../services/StripeService';
import { User } from '@prisma/client';
import formatStatsNumber from '../utils/formatStatsNumber';

class UserController {
    public async register(req: Request, res: Response) {
        const { email, username, slug, password } = req.body;
        try {
            await UserService.registerValidation(email, username, slug, password);
        } catch (exception) {
            const error = exception as Error;
            if (error.cause === 'VALIDATION') {
                return res.status(422).json({ message: error.message });
            }
            else {
                return res.sendStatus(500);
            }
        }
        const passwordHash = await AuthService.hashPassword(password);
        try {
            const newUser = await UserService.createUser(email, username, slug, passwordHash);
            res.status(201).json({ ...newUser, password: undefined });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    public async profileSearch(req: Request, res: Response) {
        const { phrase } = req.query;
        if (!phrase) return res.status(422).json({ message: 'Fraza jest wymagana' });
        const profiles = await UserService.getProfilesByPhrase(phrase as string);
        res.json(profiles);
    }

    public async createChannel(req: Request, res: Response) {
        const { user } = req.body;
        createChannel(req, res, async err => {
            if (err) {
                if (err instanceof MulterError) {
                    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                        if (err.field === 'banner') {
                            return res.status(422).json({ message: 'Banner musi być obrazem' });
                        }
                        else if (err.field === 'profileVideo') {
                            return res.status(422).json({ message: 'Filmik profilowy musi być filmem' });
                        }
                    }
                    else {
                        return res.sendStatus(500);
                    }
                }
                else {
                    return res.sendStatus(500);
                }
            }

            let params;
            try {
                params = await UserService.validateChannel(req);
            } catch (exception) {
                const error = exception as Error;
                if (error.cause === 'VALIDATION') {
                    return res.status(422).json({ message: error.message });
                }
                else {
                    return res.sendStatus(500);
                }
            }

            let bannerPath = generateUniqueId();
            try {
                await AzureService.postAzureObject(params.banner.buffer, `banners/${bannerPath}`, params.banner.mimetype);
            } catch (err) {
                return res.sendStatus(500);
            }

            let videoPath = generateUniqueId();
            try {
                await AzureService.postAzureObject(params.profileVideo.buffer, `profileVideos/${videoPath}`, params.profileVideo.mimetype);
            } catch (err) {
                return res.sendStatus(500);
            }

            let stripeProductID;
            try {
                stripeProductID = await StripeService.createStripeProduct(params.subscriptionPriceInCents, user.id);
                if (!stripeProductID) return res.sendStatus(500);
            } catch (err) {
                return res.sendStatus(500);
            }

            try {
                await UserService.createChannel(user.id, bannerPath, videoPath, params.description, stripeProductID, params.subscriptionPriceInCents);
                res.sendStatus(204);
            } catch (err) {
                res.sendStatus(500);
            }
        });
    }

    public async subscribe(req: Request, res: Response) {
        const { user } = req.body;
        const { id } = req.params;
        if (user.id === id) return res.status(422).json({ message: 'Nie możesz subskrybować samego siebie' });
        const planID = await UserService.getUserPlanID(id);
        if (!planID) return res.status(404).json({ message: 'Użytkownik nie posiada kanału' });
        const customerID = await UserService.getUserCustomerID(user.id);
        let customer;
        if (customerID) {
            const isSubscribed = await StripeService.isSubscribed(customerID, planID);
            if (isSubscribed) return res.status(422).json({ message: 'Subskrybujesz już ten profil' });
            customer = customerID;
        }
        else {
            customer = await StripeService.createStripeCustomer(user.id);
        }
        const checkoutURL = await StripeService.createStripeCheckout(customer, planID, id);
        res.json({ url: checkoutURL });
    }

    public async unsubscribe(req: Request, res: Response) {
        const { user } = req.body;
        const { id } = req.params;
        if (user.id === id) return res.status(422).json({ message: 'Nie możesz subskrybować samego siebie' });
        const planID = await UserService.getUserPlanID(id);
        if (!planID) return res.status(404).json({ message: 'Użytkownik nie posiada kanału' });
        const customerID = await UserService.getUserCustomerID(user.id);
        if (customerID) {
            const isSubscribed = await StripeService.isSubscribed(customerID, planID);
            if (!isSubscribed) return res.status(422).json({ message: 'Nie subskrybujesz tego profilu' });
        }
        else {
            return res.status(422).json({ message: 'Nie subskrybujesz tego profilu' });
        }
        await StripeService.deleteSubscription(customerID, planID);
        res.sendStatus(204);
    }

    public async profilePreview(req: Request, res: Response) {
        const { user: userPayload } = req.body;
        const { id } = req.params;
        const planID = await UserService.getUserPlanID(id);
        if (!planID) return res.status(404).json({ message: 'Użytkownik nie posiada kanału' });
        let access: boolean;
        if (!userPayload) access = false;
        else {
            const user = await UserService.findUserByEmail(userPayload.email) as User;
            if (!user.stripeCustomerID) access = false;
            else access = await StripeService.isSubscribed(user.stripeCustomerID, planID);
        }
        const profile = await UserService.getProfilePreview(id);
        if (!profile) return res.status(404).json({ message: 'Użytkownik nie istnieje' });
        profile.banner = await AzureService.getAzureObject(`banners/${profile.banner}`);
        if (!access) profile.profileVideo = await AzureService.getAzureObject(`profileVideos/${profile.profileVideo}`);
        if (profile.avatar) profile.avatar = await AzureService.getAzureObject(`pfp/${profile.avatar}`);
        res.json({ profile, isSubscribed: access });
    }

    public async profileStats(req: Request, res: Response) {
        const { id } = req.params;
        const stats = await UserService.getProfileStats(id);
        const planID = await UserService.getUserPlanID(id);
        if (!stats || !planID) return res.status(404).json({ message: 'Użytkownik nie posiada kanału' });
        const subscriptions = await StripeService.profileSubscriptionCount(planID);
        const response = {
            posts: formatStatsNumber(stats.posts),
            likes: formatStatsNumber(stats.likes),
            subscriptions: formatStatsNumber(subscriptions)
        }
        res.json(response);
    }
}

export default new UserController();