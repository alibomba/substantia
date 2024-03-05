import prisma from "../models/prisma";

async function postImageSeeder() {
    await prisma.postImage.createMany({
        data: [
            {
                path: '68frybupasfasf.jpg',
                postId: '110d493e-f5f8-4be4-8228-4a6debff2456'
            },
            {
                path: '6e5861b4-f14d-4221-92ad-8dd2be0147af',
                postId: '110d493e-f5f8-4be4-8228-4a6debff2456'
            },
            {
                path: '86wraisfbuopaslfasf.jpg',
                postId: '110d493e-f5f8-4be4-8228-4a6debff2456'
            },
            {
                path: 'a52f2194-7f85-4e19-ade2-467ec3d28f21',
                postId: 'e7d7729d-8a43-4b0d-ac9a-92526f6fa002'
            },
            {
                path: 'af14c22f-12c1-4fff-ae8e-627fb99ad2a2',
                postId: 'e7d7729d-8a43-4b0d-ac9a-92526f6fa002'
            },
            {
                path: 'agyisfi.jpg',
                postId: '303581e4-ad47-4bf3-adfb-1a551874d205'
            },
            {
                path: 'aisybifa.jpg',
                postId: '6d888bd2-e595-4a18-b4cb-dbe029b4c178'
            },
            {
                path: 'asbuifibuas.jpg',
                postId: '6d888bd2-e595-4a18-b4cb-dbe029b4c178'
            },
            {
                path: 'asufvyabisfnk.jpg',
                postId: '6d888bd2-e595-4a18-b4cb-dbe029b4c178'
            },
            {
                path: 'auisbyfbi.jpg',
                postId: '6d888bd2-e595-4a18-b4cb-dbe029b4c178'
            },
            {
                path: 'aw6fraysifbasf.jpg',
                postId: '6d888bd2-e595-4a18-b4cb-dbe029b4c178'
            },
            {
                path: 'de87c20a-6037-4533-82e8-ba70cc591447',
                postId: '6d888bd2-e595-4a18-b4cb-dbe029b4c178'
            },
            {
                path: 'fa8892a5-52b0-4f2f-a561-25107373c5b3',
                postId: '6d888bd2-e595-4a18-b4cb-dbe029b4c178'
            },
            {
                path: 'uiabsognamg.jpg',
                postId: '6d888bd2-e595-4a18-b4cb-dbe029b4c178'
            },
            {
                path: 'yiasbbuiasgb.jpg',
                postId: '6d888bd2-e595-4a18-b4cb-dbe029b4c178'
            }
        ]
    });
}

export default postImageSeeder;