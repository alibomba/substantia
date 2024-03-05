type Post = {
    id: string,
    content: string,
    videoPath: string | null,
    userId: string,
    images: PostImage[]
    poll: PostPoll | null,
    user: {
        id: string,
        username: string,
        slug: string,
        avatar: string | null
    },
    createdAt: string
}