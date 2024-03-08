import { IoSend } from 'react-icons/io5';
import PostComment from '../postComment/PostComment';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Error from '../error/Error';
import axios from 'axios';
import axiosClient from '../../axiosClient';
import Loading from '../loading/Loading';
import Popup from '../popup/Popup';

interface Props {
    postId: string
}

const PostComments = ({ postId }: Props) => {
    const [comments, setComments] = useState<PostComment[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isMore, setIsMore] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [popup, setPopup] = useState<Popup>({ content: null, active: false, type: 'good' });
    const [ref, inView] = useInView();

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function fetchData() {
            setIsLoading(true);
            try {
                const { data: res } = await axiosClient({
                    method: 'get',
                    url: `/post-comments/${postId}?page=${page}`,
                    cancelToken: source.token
                });
                const { currentPage, lastPage, data } = res;
                setComments(prev => [...prev, ...data]);
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

    async function addComment(e: React.FormEvent) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const content = form.querySelector('input') as HTMLInputElement;
        if (!content.value) return;
        try {
            const { data } = await axiosClient({
                method: 'post',
                url: `/comments/${postId}`,
                data: {
                    content: content.value
                }
            });
            form.reset();
            setPopup({ content: 'Opublikowano komentarz', active: true, type: 'good' });
            setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
            setComments(prev => ([data, ...prev]));
        } catch (err: any) {
            if (err?.response?.status === 422) {
                setPopup({ content: err?.response?.data?.message, active: true, type: 'bad' });
                setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
            }
            else {
                setError(true);
            }
        }
    }

    if (error) {
        return <Error />
    }

    return (
        <div className="px-10 max-sm:px-4 py-4 border-[3px] border-t-0 border-primary rounded-2xl rounded-tl-none rounded-tr-none">
            <form onSubmit={addComment} className="flex items-center gap-4">
                <input aria-label='Napisz komentarz' className="text-2xl max-sm:text-xl p-2 border-[3px] border-primary rounded-lg w-full" placeholder="Napisz komentarz..." type="text" required maxLength={400} />
                <button className='text-4xl text-primary hover:text-primaryHover transition-primary' title="Opublikuj komentarz">
                    <IoSend />
                </button>
            </form>
            <div className='mt-8 flex flex-col items-center gap-12'>
                {
                    comments.map((comment, index, arr) => (
                        <article key={comment.id} className='w-full'>
                            <div ref={index === arr.length - 2 ? ref : null}></div>
                            <PostComment comment={comment} />
                        </article>
                    ))
                }
                {
                    (!isLoading && !comments.length) && <p className='text-4xl max-sm:text-2xl max-[400px]:text-xl my-8 text-white bg-[rgba(255,0,0,.65)] font-medium px-8 py-4 rounded-xl text-center'>Brak komentarzy</p>
                }
                {
                    isLoading && <Loading />
                }
            </div>
            <Popup active={popup.active} type={popup.type}>{popup.content}</Popup>
        </div>
    )
}

export default PostComments
