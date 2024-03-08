import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Error from "../error/Error"
import Popup from "../popup/Popup"
import axios from "axios"
import axiosClient from "../../axiosClient"
import { FaHeart } from "react-icons/fa"
import { CiHeart } from "react-icons/ci"
import { BiSolidComment } from "react-icons/bi"
import CommentReplies from "../commentReplies/CommentReplies"


interface Props {
    comment: PostComment
}

interface CommentStats {
    likes: number,
    replies: number
}

const PostComment = ({ comment }: Props) => {
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [areRepliesVisible, setAreRepliesVisible] = useState<boolean>(false);
    const [stats, setStats] = useState<CommentStats | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [popup, setPopup] = useState<Popup>({ content: null, active: false, type: 'good' });

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function fetchData() {
            try {
                const { data } = await axiosClient({
                    method: 'get',
                    url: `/comment-stats/${comment.id}`,
                    cancelToken: source.token
                });
                setStats(data.stats);
                setIsLiked(data.isLiked);
            } catch (err) {
                setError(true);
            }
        }

        fetchData();
        return () => {
            source.cancel();
        }
    }, []);

    async function like() {
        try {
            const res = await axiosClient({
                method: 'post',
                url: `/like-comment/${comment.id}`
            });
            if (res.status === 201) {
                setIsLiked(true);
                setStats(prev => {
                    if (!prev) return prev;
                    return { ...prev, likes: prev.likes + 1 };
                });
                setPopup({ content: 'Dodano serce', active: true, type: 'good' });
            } else if (res.status === 204) {
                setIsLiked(false);
                setStats(prev => {
                    if (!prev) return prev;
                    return { ...prev, likes: prev.likes - 1 };
                });
                setPopup({ content: 'Usunięto serce', active: true, type: 'good' });
            }
            setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
        } catch (err) {
            setError(true);
        }
    }

    function toggleReplies() {
        setAreRepliesVisible(prev => !prev);
    }

    if (error) {
        return <Error />
    }

    return (
        <>
            <div>
                <div className="flex items-center gap-3">
                    <Link to={`/profil/${comment.userId}`}>
                        <img className="w-[75px] max-sm:w-[60px] h-[75px] max-sm:h-[60px] object-cover rounded-full border-[3px] border-primary" src={comment.user.avatar || '/default.png'} alt="avatar użytkownika" />
                    </Link>
                    <div className="flex flex-col items-start">
                        <h3 className="text-3xl max-sm:text-2xl font-bold"><Link to={`/profil/${comment.userId}`}>{comment.user.username}</Link></h3>
                        <p className="text-2xl max-sm:text-xl font-medium text-black65">@{comment.user.slug}</p>
                    </div>
                </div>
                <p className="mt-2 ml-[87px] max-sm:ml-0 text-2xl max-sm:text-xl text-black65 leading-relaxed">{comment.content}</p>
                {
                    stats &&
                    <div className="mt-3 ml-[87px] max-sm:ml-0 flex items-center gap-4">
                        <p className="flex items-center gap-2 max-sm:gap-1">
                            <button onClick={like} title={isLiked ? 'Usuń serce z komentarza' : 'Dodaj serce do komentarza'} className='text-4xl max-sm:text-3xl text-primary hover:text-primaryHover transition-primary'>
                                {
                                    isLiked ? <FaHeart /> : <CiHeart />
                                }
                            </button>
                            <span className='text-3xl max-sm:text-2xl font-bold'>{stats.likes}</span>
                        </p>
                        <p className="flex items-center gap-2 max-sm:gap-1">
                            <button onClick={toggleReplies} title='Przełącz widoczność odpowiedzi do komentarza' className='text-4xl max-sm:text-3xl text-primary hover:text-primaryHover transition-primary'>
                                <BiSolidComment />
                            </button>
                            <span className='text-3xl max-sm:text-2xl font-bold'>{stats.replies}</span>
                        </p>
                    </div>
                }
            </div>
            {
                areRepliesVisible &&
                <CommentReplies commentId={comment.id} />
            }
            <Popup active={popup.active} type={popup.type}>{popup.content}</Popup>
        </>
    )
}

export default PostComment
