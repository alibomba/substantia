import prisma from "../models/prisma";

async function commentSeeder() {
    await prisma.postComment.createMany({
        data: [
            {
                id: '88442583-6b09-4339-b414-b106031a06ae',
                content: 'komentarz do posta',
                postId: 'fe45aac7-c940-4a9a-939b-dba17d0262b8',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                id: '40bbb79f-3feb-47ed-8324-d71ba0af9eb1',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                postId: 'fe45aac7-c940-4a9a-939b-dba17d0262b8',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                id: '93f2c10d-b361-4214-aad7-0be6467dc261',
                content: 'Commodo sed egestas egestas fringilla phasellus faucibus scelerisque eleifend donec.',
                postId: 'fe45aac7-c940-4a9a-939b-dba17d0262b8',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                id: '2f5b890f-ac3e-40cb-8084-0eb4a4c11b6b',
                content: 'Eget arcu dictum varius duis at consectetur. Nunc mi ipsum',
                postId: 'fe45aac7-c940-4a9a-939b-dba17d0262b8',
                userId: '90da775b-411d-4f3c-ac98-29c44b3f5234'
            },
            {
                id: '29c3a8b5-7d80-497d-bd02-e8a7a86ac5e8',
                content: 'faucibus vitae aliquet nec ullamcorper. Sagittis vitae et leo duis ut diam quam nulla porttitor. Dictumst',
                postId: 'fe45aac7-c940-4a9a-939b-dba17d0262b8',
                userId: '90da775b-411d-4f3c-ac98-29c44b3f5234'
            },
            {
                id: '66c7a7db-9fd9-4349-b36e-7db576ba421e',
                content: 'Dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc.',
                postId: 'fe45aac7-c940-4a9a-939b-dba17d0262b8',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                id: 'ecbee2ff-835d-44d9-8ba1-3598f8c687db',
                content: 'Leo vel fringilla est ullamcorper. Sed velit dignissim sodales ut.',
                postId: 'fe45aac7-c940-4a9a-939b-dba17d0262b8',
                userId: '90da775b-411d-4f3c-ac98-29c44b3f5234'
            },
            {
                id: '5b6b148c-588f-48be-a4be-fca7cc869e37',
                content: 'Nec feugiat in fermentum posuere urna nec tincidunt praesent. Blandit volutpat',
                postId: 'fe45aac7-c940-4a9a-939b-dba17d0262b8',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                id: '031358fa-8d86-4ccc-9b6f-4545b1f79c64',
                content: 'maecenas volutpat blandit. Sed vulputate mi sit amet mauris. Leo duis ut diam quam nulla porttitor massa id. Porttitor leo a diam sollicitudin.',
                postId: 'fe45aac7-c940-4a9a-939b-dba17d0262b8',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                id: '88771f34-8975-47ad-a959-a3e6bfb8e68d',
                content: 'Magna fringilla urna porttitor rhoncus dolor. Consectetur lorem donec massa sapien faucibus et molestie. At erat pellentesque adipiscing commodo. Sollicitudin ac orci phasellus egestas tellus rutrum.',
                postId: 'fe45aac7-c940-4a9a-939b-dba17d0262b8',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                id: '892d62a4-9955-4d9f-8829-8235b46c9720',
                content: 'Amet risus nullam eget felis. Libero nunc consequat interdum varius. Non enim praesent elementum facilisis leo vel fringilla. Sagittis purus sit amet volutpat consequat. Turpis egestas sed tempus urna et pharetra pharetra massa massa.',
                postId: 'fe45aac7-c940-4a9a-939b-dba17d0262b8',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                id: '7c4e0920-2797-426b-a2f3-7214f9798923',
                content: 'Egestas integer eget aliquet nibh praesent tristique magna sit. Sed elementum tempus egestas sed sed risus pretium. Massa sed elementum tempus egestas sed sed. Purus ut faucibus pulvinar elementum integer enim neque volutpat ac. Felis donec et odio pellentesque diam volutpat. Eu augue ut lectus arcu. Nulla porttitor massa id neque aliquam vestibulum. Arcu non sodales neque sodales ut etiam.',
                postId: 'fe45aac7-c940-4a9a-939b-dba17d0262b8',
                userId: '90da775b-411d-4f3c-ac98-29c44b3f5234'
            },
            {
                id: 'a6c9c160-1ee1-4e08-b957-f61222aa7577',
                content: 'Nulla porttitor massa id neque aliquam vestibulum. Arcu non sodales neque sodales ut etiam. Maecenas accumsan lacus vel facilisis volutpat est velit.',
                postId: 'fe45aac7-c940-4a9a-939b-dba17d0262b8',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            }
        ]
    });
}

export default commentSeeder;