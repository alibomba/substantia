import prisma from "../models/prisma";
import AzureService from "./AzureService";

class CommentService {
    public async getComment(id: string) {
        const comment = await prisma.postComment.findUnique({ where: { id }, include: { user: { select: { id: true, username: true, slug: true, avatar: true } } } });
        if (!comment) return null;
        if (comment.user.avatar) comment.user.avatar = await AzureService.getAzureObject(`pfp/${comment.user.avatar}`);
        return comment;
    }

    public async getPostComments(id: string, page: number) {
        const PER_PAGE = 7;
        const commentCount = await prisma.postComment.count({ where: { postId: id } });
        if (!commentCount) return { currentPage: 0, lastPage: 0, data: [] };
        const lastPage = Math.ceil(commentCount / PER_PAGE);
        if (page > lastPage) return { lastPage, currentPage: lastPage, data: [] };
        const offset = (page - 1) * PER_PAGE;
        const commentIds = await prisma.postComment.findMany({
            where: { postId: id },
            take: PER_PAGE,
            skip: offset,
            select: { id: true },
            orderBy: { createdAt: 'desc' }
        });
        const comments = await Promise.all(commentIds.map(async item => {
            const id = item.id;
            return await this.getComment(id);
        }));
        return {
            currentPage: page,
            lastPage,
            data: comments
        }
    }
}

export default new CommentService();