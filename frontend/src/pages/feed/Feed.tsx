import { useContext, useEffect, useState } from "react"
import PostForm from "../../components/postForm/PostForm"
import { AuthContext } from "../../contexts/AuthProvider"

const Feed = () => {
    const { payload: { hasChannel } } = useContext<MyAuthContext>(AuthContext);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        console.log(posts);
    }, [posts]);

    return (
        <main className="px-8 py-4 flex flex-col items-center gap-8">
            {
                hasChannel &&
                <PostForm
                    setPosts={setPosts}
                />
            }
        </main>
    )
}

export default Feed
