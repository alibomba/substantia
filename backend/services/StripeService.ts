import Stripe from "stripe";



class StripeService {
    private getStripeInstance() {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-10-16' });
        return stripe;
    }

    public async createStripeCustomer() {
        const stripe = this.getStripeInstance();
        const customer = await stripe.customers.create();
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
}

export default new StripeService();