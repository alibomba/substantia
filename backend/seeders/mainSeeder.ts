import prisma from "../models/prisma";
import userSeeder from "./userSeeder";
import postSeeder from "./postSeeder";
import postImageSeeder from "./postImageSeeder";
import postPollSeeder from "./postPollSeeder";
import postPollOptionSeeder from "./postPollOptionSeeder";
import postPollVotesSeeder from "./postPollVotesSeeder";

async function truncate() {
    await prisma.bookmark.deleteMany();
    await prisma.commentLike.deleteMany();
    await prisma.commentReply.deleteMany();
    await prisma.passwordResetToken.deleteMany();
    await prisma.post.deleteMany();
    await prisma.postComment.deleteMany();
    await prisma.postImage.deleteMany();
    await prisma.postLike.deleteMany();
    await prisma.postPoll.deleteMany();
    await prisma.postPollOption.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.replyLike.deleteMany();
    await prisma.user.deleteMany();
}

async function main() {
    await truncate();
    await userSeeder();
    await postSeeder();
    await postImageSeeder();
    await postPollSeeder();
    await postPollOptionSeeder();
    await postPollVotesSeeder();

    console.log('DB seeded');
}

main();