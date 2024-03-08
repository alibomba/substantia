import { useEffect, useState } from "react"
import Error from "../error/Error";
import CommentReply from "../commentReply/CommentReply";
import axios from "axios";
import axiosClient from "../../axiosClient";
import { IoSend } from "react-icons/io5";
import Popup from "../popup/Popup";


interface Props {
    commentId: string
}

const CommentReplies = ({ commentId }: Props) => {
    const [replies, setReplies] = useState<CommentReply[]>([]);
    const [error, setError] = useState<boolean>(false);
    const [popup, setPopup] = useState<Popup>({ content: null, active: false, type: 'good' });

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function fetchData() {
            try {
                const { data } = await axiosClient({
                    method: 'get',
                    url: `/comment-replies/${commentId}`,
                    cancelToken: source.token
                });
                setReplies(data);
            } catch (err) {
                setError(true);
            }
        }

        fetchData();
        return () => {
            source.cancel();
        }
    }, []);

    async function addReply(e: React.FormEvent) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const content = form.querySelector('input') as HTMLInputElement;
        if (!content.value) return;
        try {
            const { data } = await axiosClient({
                method: 'post',
                url: `/comment-replies/${commentId}`,
                data: {
                    content: content.value
                }
            });
            form.reset();
            setPopup({ content: 'Opublikowano odpowiedź', active: true, type: 'good' });
            setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
            setReplies(prev => [{ ...data, likes: 0 }, ...prev]);
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
        <div className="mt-4 flex flex-col gap-8">
            <form data-testid='replyForm' onSubmit={addReply} className="flex items-center gap-4">
                <input aria-label='Odpowiedz' className="text-2xl max-sm:text-xl p-2 border-[3px] border-primary rounded-lg w-full" placeholder="Odpowiedz..." type="text" required maxLength={400} />
                <button className="text-4xl text-primary hover:text-primaryHover transition-primary" title="Opublikuj odpowiedź">
                    <IoSend />
                </button>
            </form>
            {
                replies.map(reply => (
                    <CommentReply key={reply.id} reply={reply} setReplies={setReplies} />
                ))
            }
            <Popup active={popup.active} type={popup.type}>{popup.content}</Popup>
        </div>
    )
}

export default CommentReplies
