import { useEffect, useState } from "react"
import Loading from "../../components/loading/Loading";
import Error from "../../components/error/Error";
import Post from "../../components/post/Post";
import axios from "axios";
import axiosClient from "../../axiosClient";

const Bookmarks = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function fetchData() {
            try {
                const { data } = await axiosClient({
                    method: 'get',
                    url: '/my-bookmarks',
                    cancelToken: source.token
                });
                setPosts(data);
            } catch (err) {
                setError(true);
            }
            setIsLoading(false);
        }

        fetchData();
        return () => {
            source.cancel();
        }
    }, []);

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return <Error />
    }

    return (
        <main className="px-8 max-sm:px-3 py-4 flex flex-col items-center gap-8">
            {
                posts.length > 0 ?
                    posts.map(post => (
                        <article key={post.id} className="w-[900px] max-w-full">
                            <Post post={post} />
                        </article>
                    ))
                    :
                    <p className="text-6xl max-sm:text-4xl max-[400px]:text-2xl my-8 text-white bg-[rgba(255,0,0,.65)] font-medium px-8 py-4 rounded-xl text-center">Brak zapisanych postów</p>
            }
        </main>
    )
}

export default Bookmarks
