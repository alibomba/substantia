import prisma from "../models/prisma";

async function userSeeder() {
    await prisma.user.createMany({
        data: [
            {
                id: '1afe048e-229d-40d2-a17e-a1aa5cb6c009',
                email: 'wojci.bro@gmail.com',
                username: 'WojciBro',
                slug: 'wojcibro',
                avatar: 'cv1.png',
                banner: 'bee41c2c-83d8-4f0c-a3bf-fec363cb3796',
                profileVideo: '6MBvideo.mp4',
                oAuth: false,
                description: 'test profile description',
                hasChannel: true,
                password: '$2b$10$h9./CcTKzukWlJJjXE1JAeS/wsEl5jstnBkCsMoO2F8rlAa1h7ZKS',
                subscriptionPrice: 1299,
                stripeChannelPlanID: 'plan_PdnAxSSM0xsCId',
                stripeCustomerID: 'cus_Pfwam5heXIkJKb'
            },
            {
                id: '90da775b-411d-4f3c-ac98-29c44b3f5234',
                email: 'adam@gmail.com',
                username: 'Adam',
                slug: 'adam123',
                oAuth: false,
                hasChannel: false,
                password: '$2b$10$h9./CcTKzukWlJJjXE1JAeS/wsEl5jstnBkCsMoO2F8rlAa1h7ZKS',
            },
            {
                id: '3b8160fe-41a2-4e58-b441-ea55f689eec9',
                email: 'test@gmail.com',
                username: 'TestUser',
                slug: 'testuser',
                avatar: '84ee4191-380b-4a10-9f9a-2090d235e254',
                banner: 'bee41c2c-83d8-4f0c-a3bf-fec363cb3796',
                profileVideo: '6MBvideo.mp4',
                oAuth: false,
                description: 'another test profile description',
                hasChannel: true,
                password: '$2b$10$h9./CcTKzukWlJJjXE1JAeS/wsEl5jstnBkCsMoO2F8rlAa1h7ZKS',
                subscriptionPrice: 1740,
                stripeChannelPlanID: 'plan_PfwZwuaYkfnPZz',
            },
        ]
    });
}

export default userSeeder;