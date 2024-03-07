import prisma from "../models/prisma";

async function commentReplySeeder() {
    await prisma.commentReply.createMany({
        data: [
            {
                content: 'Diam quam nulla porttitor massa id neque aliquam vestibulum. Aliquet bibendum enim facilisis gravida',
                commentId: '88442583-6b09-4339-b414-b106031a06ae',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009',
            },
            {
                content: 'Non blandit massa enim nec dui. At elementum eu facilisis sed odio morbi.',
                commentId: '88442583-6b09-4339-b414-b106031a06ae',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009',
            },
            {
                content: 'Cum sociis natoque penatibus et magnis dis. Semper risus in hendrerit gravida rutrum quisque non tellus. Scelerisque eu ultrices vitae auctor eu. Tincidunt eget nullam non nisi. Ipsum faucibus vitae aliquet nec.',
                commentId: '88442583-6b09-4339-b414-b106031a06ae',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009',
            },
            {
                content: 'Facilisis gravida neque convallis a cras semper auctor neque vitae.',
                commentId: '88442583-6b09-4339-b414-b106031a06ae',
                userId: '90da775b-411d-4f3c-ac98-29c44b3f5234',
            },
            {
                content: 'Morbi tempus iaculis urna id volutpat. Posuere ac ut consequat semper viverra nam libero',
                commentId: '2f5b890f-ac3e-40cb-8084-0eb4a4c11b6b',
                userId: '90da775b-411d-4f3c-ac98-29c44b3f5234',
            },
            {
                content: 'justo laoreet. Enim neque volutpat ac tincidunt vitae. Magna sit amet purus gravida quis blandit turpis. Id leo in vitae turpis',
                commentId: '2f5b890f-ac3e-40cb-8084-0eb4a4c11b6b',
                userId: '90da775b-411d-4f3c-ac98-29c44b3f5234',
            },
            {
                content: 'Duis at tellus at urna condimentum mattis pellentesque id nibh. Dignissim suspendisse in est ante in nibh mauris.',
                commentId: '2f5b890f-ac3e-40cb-8084-0eb4a4c11b6b',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9',
            },
            {
                content: 'At urna condimentum mattis pellentesque id nibh tortor. Lorem sed risus ultricies tristique nulla aliquet enim tortor.',
                commentId: '66c7a7db-9fd9-4349-b36e-7db576ba421e',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9',
            },
            {
                content: 'Id neque aliquam vestibulum morbi blandit cursus. Egestas diam in arcu cursus euismod quis viverra nibh cras. Tellus elementum sagittis vitae et leo duis. Pellentesque',
                commentId: '66c7a7db-9fd9-4349-b36e-7db576ba421e',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9',
            },
            {
                content: 'Tristique risus nec feugiat in fermentum posuere urna. Blandit turpis cursus in hac habitasse platea dictumst quisque. Quis lectus nulla at volutpat.',
                commentId: '66c7a7db-9fd9-4349-b36e-7db576ba421e',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009',
            },
            {
                content: 'Mattis aliquam faucibus purus in massa tempor nec.',
                commentId: '66c7a7db-9fd9-4349-b36e-7db576ba421e',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009',
            },
            {
                content: 'Sit amet justo donec enim diam vulputate ut pharetra sit. Congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque.',
                commentId: '5b6b148c-588f-48be-a4be-fca7cc869e37',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009',
            }
        ]
    });
}

export default commentReplySeeder;