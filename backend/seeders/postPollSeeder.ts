import prisma from "../models/prisma";

async function postPollSeeder() {
    await prisma.postPoll.createMany({
        data: [
            {
                id: '69aaf13e-a866-46ea-a961-fc4ccc6f789e',
                postId: 'e7d7729d-8a43-4b0d-ac9a-92526f6fa002'
            },
            {
                id: 'bc8486f4-237b-49b9-9758-9b1ec5569d89',
                postId: 'ebd4c088-f7f9-42a9-9fe0-b25eb2c56bd8'
            }
        ]
    });
}

export default postPollSeeder;