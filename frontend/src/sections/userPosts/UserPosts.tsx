import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer";
import Error from "../../components/error/Error";
import Post from "../../components/post/Post";
import Loading from "../../components/loading/Loading";
import axios from "axios";
import axiosClient from "../../axiosClient";

interface Props {
    id: string
}

const UserPosts = ({ id }: Props) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isMore, setIsMore] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [ref, inView] = useInView();

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function fetchData() {
            setIsLoading(true);
            try {
                const { data: res } = await axiosClient({
                    method: 'get',
                    url: `/user-posts/${id}?page=${page}`,
                    cancelToken: source.token
                });
                const { currentPage, lastPage, data } = res;
                setPosts(prev => ([...prev, ...data]));
                if (currentPage >= lastPage) {
                    setIsMore(false);
                }
            } catch (err) {
                setError(true);
            }
            setIsLoading(false);
        }

        if (isMore) {
            fetchData();
        }
        return () => {
            source.cancel();
        }
    }, [page]);

    useEffect(() => {
        if (inView && isMore) {
            setPage(prev => prev + 1);
        }
    }, [inView]);

    if (error) {
        return <Error />
    }

    return (
        <section className="px-8 max-sm:px-3 py-4 flex flex-col items-center gap-8">
            {
                posts.map((post, index, arr) => (
                    <article key={post.id} className="w-[900px] max-w-full">
                        <div ref={index === arr.length - 3 ? ref : null}></div>
                        <Post post={post} />
                    </article>
                ))
            }
            {
                (!isLoading && !posts.length) && <p className="text-6xl max-sm:text-4xl max-[400px]:text-2xl my-8 text-white bg-[rgba(255,0,0,.65)] font-medium px-8 py-4 rounded-xl text-center">Brak postów</p>
            }
            {
                isLoading && <Loading />
            }
        </section>
    )
}

export default UserPosts
