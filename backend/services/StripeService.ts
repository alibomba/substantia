import Stripe from "stripe";
import prisma from "../models/prisma";
import UserService from "./UserService";


class StripeService {
    private getStripeInstance() {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-10-16' });
        return stripe;
    }

    public async createStripeCustomer(userId: string) {
        const stripe = this.getStripeInstance();
        const customer = await stripe.customers.create();
        await prisma.user.update({ where: { id: userId }, data: { stripeCustomerID: customer.id } });
        return customer.id;
    }

    public async createStripeProduct(priceInCents: number, userId: string) {
        const stripe = this.getStripeInstance();
        const plan = await stripe.plans.create({
            amount: priceInCents,
            currency: 'PLN',
            interval: 'month',
            product: { name: userId }
        });
        return plan.id;
    }

    public async createStripeCheckout(customerID: string, planID: string, profileID: string) {
        const stripe = this.getStripeInstance();
        const session = await stripe.checkout.sessions.create({
            customer: customerID,
            billing_address_collection: 'auto',
            line_items: [
                {
                    price: planID,
                    quantity: 1
                }
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/profil/${profileID}`,
            cancel_url: `${process.env.FRONTEND_URL}/profil/${profileID}`
        });
        return session.url;
    }

    public async isSubscribed(customerID: string, planID: string) {
        const stripe = this.getStripeInstance();
        const subscriptions = await stripe.subscriptions.list({
            customer: customerID,
            plan: planID,
            status: 'active'
        });
        return subscriptions.data.length > 0;
    }

    public async deleteSubscription(customerID: string, planID: string) {
        const stripe = this.getStripeInstance();
        const subscriptions = await stripe.subscriptions.list({
            customer: customerID,
            plan: planID,
            status: 'active'
        });
        const subscriptionID = subscriptions.data[0].id;
        await stripe.subscriptions.cancel(subscriptionID);
    }

    public async profileSubscriptionCount(planID: string) {
        const stripe = this.getStripeInstance();
        const subscriptions = await stripe.subscriptions.list({
            plan: planID,
            status: 'active'
        });
        return subscriptions.data.length;
    }

    public async userSubscriptionPlansList(customerID: string) {
        const stripe = this.getStripeInstance();
        const subscriptions = await stripe.subscriptions.list({
            customer: customerID,
            status: 'active'
        });
        return subscriptions.data.map(subscription => subscription.items.data[0].plan.id);
    }

    public async isSubscribedToPollOwner(id: string, userId: string) {
        const customerID = await UserService.getUserCustomerID(userId);
        if (!customerID) return false;
        const poll = await prisma.postPoll.findUnique({ where: { id }, select: { post: { select: { userId: true } } } });
        const planID = await UserService.getUserPlanID(poll!.post.userId) as string;
        return this.isSubscribed(customerID, planID);
    }

    public async isSubscribedToPostOwner(id: string, userId: string) {
        const customerID = await UserService.getUserCustomerID(userId);
        if (!customerID) return false;
        const post = await prisma.post.findUnique({ where: { id }, select: { userId: true } });
        const planID = await UserService.getUserPlanID(post!.userId) as string;
        return await this.isSubscribed(customerID, planID);
    }

    public async isSubscribedToCommentedPostOwner(id: string, userId: string) {
        const customerID = await UserService.getUserCustomerID(userId);
        if (!customerID) return false;
        const comment = await prisma.postComment.findUnique({
            where: { id },
            select: { post: { select: { userId: true } } }
        });
        const planID = await UserService.getUserPlanID(comment!.post.userId) as string;
        return await this.isSubscribed(customerID, planID);
    }

    public async isSubscribedToRepliedPostOwner(id: string, userId: string) {
        const customerID = await UserService.getUserCustomerID(userId);
        if (!customerID) return false;
        const reply = await prisma.commentReply.findUnique({
            where: { id },
            select: { comment: { select: { post: { select: { userId: true } } } } }
        });
        const planID = await UserService.getUserPlanID(reply!.comment.post.userId) as string;
        return await this.isSubscribed(customerID, planID);
    }
}

export default new StripeService();