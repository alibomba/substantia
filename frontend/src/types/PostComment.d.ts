type PostComment = {
    id: string,
    content: string,
    userId: string,
    postId: string,
    user: {
        id: string,
        username: string,
        slug: string,
        avatar: string | null
    },
    createdAt: string
}