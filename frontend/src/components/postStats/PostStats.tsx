import { FaHeart, FaBookmark } from 'react-icons/fa';
import { CiHeart, CiBookmark } from 'react-icons/ci';
import { BiSolidComment } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import Error from '../error/Error';
import Popup from '../popup/Popup';
import axios from 'axios';
import axiosClient from '../../axiosClient';

interface Props {
    postId: string
    setAreCommentsVisible: React.Dispatch<React.SetStateAction<boolean>>
}

interface PostStats {
    likes: number,
    comments: number
}

const PostStats = ({ postId, setAreCommentsVisible }: Props) => {
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
    const [stats, setStats] = useState<PostStats | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [popup, setPopup] = useState<Popup>({ content: null, active: false, type: 'good' });

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function fetchData() {
            try {
                const { data } = await axiosClient({
                    method: 'get',
                    url: `/post-stats/${postId}`,
                    cancelToken: source.token
                });
                setStats(data.stats);
                setIsLiked(data.isLiked);
                setIsBookmarked(data.isBookmarked);
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
                url: `/like-post/${postId}`
            });
            if (res.status === 201) {
                setIsLiked(true);
                setStats(prev => {
                    if (!prev) return prev;
                    return { ...prev, likes: prev.likes + 1 };
                })
                setPopup({ content: 'Dodano serce', active: true, type: 'good' });
            } else if (res.status === 204) {
                setIsLiked(false);
                setStats(prev => {
                    if (!prev) return prev;
                    return { ...prev, likes: prev.likes - 1 };
                })
                setPopup({ content: 'Usunięto serce', active: true, type: 'good' });
            }
            setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
        } catch (err) {
            setError(true);
        }
    }

    async function bookmark() {
        try {
            const res = await axiosClient({
                method: 'post',
                url: `/bookmark-post/${postId}`
            });
            if (res.status === 201) {
                setIsBookmarked(true);
                setPopup({ content: 'Dodano do zapisanych', active: true, type: 'good' });
            } else if (res.status === 204) {
                setIsBookmarked(false);
                setPopup({ content: 'Usunięto z zapisanych', active: true, type: 'good' });
            }
            setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
        } catch (err) {
            setError(true);
        }
    }

    function toggleComments() {
        setAreCommentsVisible(prev => !prev);
    }

    if (!stats) {
        return <></>
    }

    if (error) {
        return <Error />
    }

    return (
        <div className="mt-4 ml-[101px] max-sm:ml-0 flex items-center gap-6 max-sm:gap-4 flex-wrap">
            <p className="flex items-center gap-3 max-sm:gap-2">
                <button onClick={like} title={isLiked ? 'Usuń serce z posta' : 'Dodaj serce do posta'} className='text-5xl max-sm:text-4xl text-primary hover:text-primaryHover transition-primary'>
                    {
                        isLiked ? <FaHeart /> : <CiHeart />
                    }
                </button>
                <span data-testid='likeCount' className='text-4xl max-sm:text-3xl font-bold'>{stats.likes}</span>
            </p>
            <p className="flex items-center gap-3">
                <button onClick={toggleComments} title='Przełącz widoczność komentarzy do posta' className='text-5xl max-sm:text-4xl text-primary hover:text-primaryHover transition-primary'>
                    <BiSolidComment />
                </button>
                <span data-testid='commentCount' className='text-4xl max-sm:text-3xl font-bold'>{stats.comments}</span>
            </p>
            <p className="flex items-center gap-3">
                <button onClick={bookmark} title={isBookmarked ? 'Usuń post z zapisanych' : 'Zapisz post'} className='text-5xl max-sm:text-4xl text-primary hover:text-primaryHover transition-primary'>
                    {
                        isBookmarked ? <FaBookmark /> : <CiBookmark />
                    }
                </button>
            </p>
            <Popup active={popup.active} type={popup.type}>{popup.content}</Popup>
        </div>
    )
}

export default PostStats
