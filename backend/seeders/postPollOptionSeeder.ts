import prisma from "../models/prisma";

async function postPollOptionSeeder() {
    await prisma.postPollOption.createMany({
        data: [
            {
                label: 'option 1',
                pollId: '69aaf13e-a866-46ea-a961-fc4ccc6f789e'
            },
            {
                label: 'option 2',
                pollId: '69aaf13e-a866-46ea-a961-fc4ccc6f789e'
            },
            {
                label: 'option 3',
                pollId: '69aaf13e-a866-46ea-a961-fc4ccc6f789e'
            },
            {
                label: 'lorem ipsum',
                pollId: 'bc8486f4-237b-49b9-9758-9b1ec5569d89'
            },
            {
                label: 'dolor sit amet',
                pollId: 'bc8486f4-237b-49b9-9758-9b1ec5569d89'
            },
            {
                label: 'Sed ut perspiciatis',
                pollId: 'bc8486f4-237b-49b9-9758-9b1ec5569d89'
            },
        ]
    });
}

export default postPollOptionSeeder;