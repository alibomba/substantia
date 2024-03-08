type CommentReply = {
    id: string,
    content: string,
    userId: string,
    commentId: string,
    user: {
        id: string,
        username: string,
        slug: string,
        avatar: string | null
    },
    likes: number,
    createdAt: string
}