import prisma from "../models/prisma";

async function postSeeder() {
    await prisma.post.createMany({
        data: [
            {
                id: 'fe45aac7-c940-4a9a-939b-dba17d0262b8',
                content: 'testowy content posta',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009'
            },
            {
                id: '24ba3d34-70d2-4cd6-8852-81217bd151f5',
                content: 'czesc, to mój kolejny post',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009',
                videoPath: 'holy-moly.mp4'
            },
            {
                id: '110d493e-f5f8-4be4-8228-4a6debff2456',
                content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est.',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009'
            },
            {
                id: 'e7d7729d-8a43-4b0d-ac9a-92526f6fa002',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009'
            },
            {
                id: '6d888bd2-e595-4a18-b4cb-dbe029b4c178',
                content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                id: '303581e4-ad47-4bf3-adfb-1a551874d205',
                content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                id: 'ebd4c088-f7f9-42a9-9fe0-b25eb2c56bd8',
                content: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009'
            },
            {
                content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro.',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009'
            },
            {
                content: 'At vero eos et accusamus',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009'
            },
            {
                content: 'officia deserunt mollitia animi',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009'
            },
            {
                content: 'Temporibus autem quibusdam et aut officiis debitis.',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009'
            },
            {
                content: 'Quis autem vel eum iure reprehenderit qui',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009'
            },
            {
                content: 'vel illum qui dolorem eum fugiat',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009'
            },
            {
                content: 'praesentium voluptatum deleniti atque corrupti quos',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009'
            },
            {
                content: 'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
                userId: '1afe048e-229d-40d2-a17e-a1aa5cb6c009'
            },
            //
            {
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, perferendis?',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit, earum!',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae minus tempore blanditiis pariatur, excepturi repellat cupiditate et nobis quas. Mollitia!',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                content: 'Lorem ipsum dolor sit amet.',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque fugiat accusamus tempora veritatis, voluptatem ab aut sunt corrupti eius dolore minus nisi eveniet ducimus suscipit dolorem rerum? Similique, inventore ullam.',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum, autem?',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, eligendi vero. Adipisci.',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                content: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad quaerat iusto iure soluta veniam laboriosam voluptatibus nostrum assumenda fugiat sequi.',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, sapiente praesentium?',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium minima corporis esse ipsam.',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, porro?',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae.',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            },
            {
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, obcaecati!',
                userId: '3b8160fe-41a2-4e58-b441-ea55f689eec9'
            }
        ]
    });
}

export default postSeeder;