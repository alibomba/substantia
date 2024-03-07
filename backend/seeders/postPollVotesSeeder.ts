import prisma from "../models/prisma";

async function postPollVotesSeeder() {
    await prisma.user.update({
        where: { id: '90da775b-411d-4f3c-ac98-29c44b3f5234' }, data: {
            pollVotes: {
                disconnect: { id: 'a229f002-a730-45a0-ac8e-5bf888baf100' }
            }
        }
    });
    await prisma.user.update({
        where: { id: '90da775b-411d-4f3c-ac98-29c44b3f5234' },
        data: {
            pollVotes: {
                connect: { id: 'a229f002-a730-45a0-ac8e-5bf888baf100' }
            }
        }
    });
    await prisma.user.update({
        where: { id: '3b8160fe-41a2-4e58-b441-ea55f689eec9' }, data: {
            pollVotes: {
                disconnect: { id: 'c0125f97-68a8-4426-bf9c-3dcda3e16342' }
            }
        }
    });
    await prisma.user.update({
        where: { id: '3b8160fe-41a2-4e58-b441-ea55f689eec9' },
        data: {
            pollVotes: {
                connect: { id: 'c0125f97-68a8-4426-bf9c-3dcda3e16342' }
            }
        }
    });
}

export default postPollVotesSeeder;