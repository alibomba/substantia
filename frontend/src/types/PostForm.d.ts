type PostForm = {
    content: string,
    images: File[],
    video: File | null,
    poll: string[]
}