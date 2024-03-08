import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Error from "../error/Error";
import Popup from "../popup/Popup";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import axiosClient from "../../axiosClient";
import axios from "axios";


interface Props {
    reply: CommentReply
    setReplies: React.Dispatch<React.SetStateAction<CommentReply[]>>
}

const CommentReply = ({ reply, setReplies }: Props) => {
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [popup, setPopup] = useState<Popup>({ content: null, active: false, type: 'good' });

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function fetchData() {
            try {
                const { data } = await axiosClient({
                    method: 'get',
                    url: `/is-reply-liked/${reply.id}`,
                    cancelToken: source.token
                });
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
                url: `/like-reply/${reply.id}`
            });
            if (res.status === 201) {
                setIsLiked(true);
                setReplies(prev => {
                    const newValue = [...prev];
                    let indexOfReply;
                    for (let i = 0; i < newValue.length; i++) {
                        if (newValue[i].id === reply.id) {
                            indexOfReply = i;
                        }
                    }
                    newValue[indexOfReply!].likes = newValue[indexOfReply!].likes + 1;
                    return newValue;
                });
                setPopup({ content: 'Dodano serce', active: true, type: 'good' });
            } else if (res.status === 204) {
                setIsLiked(false);
                setReplies(prev => {
                    const newValue = [...prev];
                    let indexOfReply;
                    for (let i = 0; i < newValue.length; i++) {
                        if (newValue[i].id === reply.id) {
                            indexOfReply = i;
                        }
                    }
                    newValue[indexOfReply!].likes = newValue[indexOfReply!].likes - 1;
                    return newValue;
                });
                setPopup({ content: 'Usunięto serce', active: true, type: 'good' });
            }
            setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
        } catch (err) {
            setError(true);
        }
    }

    if (error) {
        return <Error />
    }

    return (
        <article className="ml-[87px] max-sm:ml-[45px]">
            <div className="flex items-center gap-3">
                <Link to={`/profil/${reply.userId}`}>
                    <img data-testid='avatar' className="w-[75px] max-sm:w-[60px] h-[75px] max-sm:h-[60px] object-cover rounded-full border-[3px] border-primary" src={reply.user.avatar || '/default.png'} alt="avatar użytkownika" />
                </Link>
                <div className="flex flex-col items-start">
                    <h3 className="text-3xl max-sm:text-2xl font-bold"><Link to={`/profil/${reply.userId}`}>{reply.user.username}</Link></h3>
                    <p className="text-2xl max-sm:text-xl font-medium text-black65">@{reply.user.slug}</p>
                </div>
            </div>
            <p className="mt-2 ml-[87px] max-sm:ml-0 text-2xl max-sm:text-xl text-black65 leading-relaxed">{reply.content}</p>
            <p className="mt-3 ml-[87px] max-sm:ml-0 flex items-center gap-2 max-sm:gap-1">
                <button onClick={like} title={isLiked ? 'Usuń serce z odpowiedzi' : 'Dodaj serce do odpowiedzi'} className="text-4xl max-sm:text-3xl text-primary hover:text-primaryHover transition-primary">
                    {
                        isLiked ? <FaHeart /> : <CiHeart />
                    }
                </button>
                <span data-testid='likeCount' className="text-3xl max-sm:text-2xl font-bold">{reply.likes}</span>
            </p>
            <Popup active={popup.active} type={popup.type}>{popup.content}</Popup>
        </article>
    )
}

export default CommentReply
