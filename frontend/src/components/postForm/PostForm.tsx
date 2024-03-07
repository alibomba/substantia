import { useContext, useState } from "react"
import { AuthContext } from "../../contexts/AuthProvider"
import { FaImage, FaVideo, FaPoll } from 'react-icons/fa';
import PostPollForm from "../postPollForm/PostPollForm";
import Popup from "../popup/Popup";
import Error from "../error/Error";
import axiosClient from "../../axiosClient";

interface Props {
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>
}

const PostForm = ({ setPosts }: Props) => {
    const { payload: { avatar } } = useContext<MyAuthContext>(AuthContext);
    const [postForm, setPostForm] = useState<PostForm>({ content: '', images: [], video: null, poll: [] });
    const [isPollFormActive, setIsPollFormActive] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [popup, setPopup] = useState<Popup>({ content: null, active: false, type: 'good' });

    function changeContent(e: React.ChangeEvent) {
        const input = e.target as HTMLInputElement;
        setPostForm(prev => ({ ...prev, content: input.value }));
    }

    function changeFiles(e: React.ChangeEvent) {
        const input = e.target as HTMLInputElement;
        setPostForm(prev => {
            switch (input.id) {
                case 'images':
                    const files = input.files;
                    if (!files || files.length === 0) return { ...prev, images: [] };
                    const images = [];
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        images.push(file);
                    }
                    return { ...prev, images };
                    break;
                case 'video':
                    const file = input.files?.[0];
                    if (!file) return { ...prev, video: null };
                    return { ...prev, video: file };
                    break;
                default:
                    return prev;
                    break;
            }
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('content', postForm.content);
        if (postForm.images.length > 0) {
            postForm.images.forEach(file => {
                formData.append('images', file);
            });
        }
        if (postForm.video) formData.append('video', postForm.video);
        if (postForm.poll.length > 0) {
            const pollJSON = JSON.stringify(postForm.poll);
            formData.append('poll', pollJSON);
        }
        try {
            const { data } = await axiosClient({
                method: 'post',
                url: '/posts',
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setPostForm({ content: '', images: [], video: null, poll: [] });
            setPopup({ content: 'Opublikowano post', active: true, type: 'good' });
            setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
            setPosts(prev => ([data, ...prev]));
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
        <form onSubmit={handleSubmit} className="mb-16 p-2 w-[900px] max-w-full border-[3px] border-primary rounded-2xl">
            <div className="flex items-center gap-4 max-[500px]:flex-col max-[500px]:items-start">
                <img className="w-[85px] max-sm:w-[70px] h-[85px] max-sm:h-[70px] object-cover rounded-full border-[3px] border-primary" src={avatar ? avatar : '/default.png'} alt="avatar" />
                <input data-testid='postContentInput' value={postForm.content} onChange={changeContent} className="p-2 text-3xl max-sm:text-2xl border-[3px] w-full border-primary rounded-lg" aria-label='Treść posta' placeholder="Napisz coś..." type="text" maxLength={500} required />
            </div>
            <div className=" ml-[101px] max-sm:ml-[86px] max-[500px]:ml-0 max-[500px]:mt-4 flex items-center gap-6 max-sm:gap-4 flex-wrap">
                <label data-testid='postButton' className="flex items-center gap-2 cursor-pointer" htmlFor="images">
                    <FaImage className="text-3xl max-sm:text-2xl text-primary" />
                    <span className="text-2xl max-sm:text-xl font-medium">{postForm.images.length ? `Wybrano ${postForm.images.length} zdjęć` : 'Dodaj zdjęcie/a'}</span>
                </label>
                <input onChange={changeFiles} type="file" multiple id="images" style={{ display: 'none' }} />
                <label data-testid='postButton' className="flex items-center gap-2 cursor-pointer" htmlFor="video">
                    <FaVideo className="text-3xl max-sm:text-2xl text-primary" />
                    <span className="text-2xl max-sm:text-xl font-medium">{postForm.video ? 'Wybrano film' : 'Dodaj film'}</span>
                </label>
                <input onChange={changeFiles} type="file" id="video" style={{ display: 'none' }} />
                <button data-testid='postButton' onClick={() => setIsPollFormActive(true)} type="button" className="flex items-center gap-2">
                    <FaPoll className="text-3xl max-sm:text-2xl text-primary" />
                    <span className="text-2xl max-sm:text-xl font-medium">{postForm.poll.length ? 'Edytuj ankietę' : 'Dodaj ankietę'}</span>
                </button>
                <button className="text-2xl max-sm:text-xl text-white bg-primary hover:bg-primaryHover transition-primary px-4 py-1 font-medium rounded-full">Opublikuj</button>
            </div>
            {
                isPollFormActive &&
                <PostPollForm
                    postForm={postForm}
                    setPostForm={setPostForm}
                    setIsPollFormActive={setIsPollFormActive}
                />
            }
            <Popup active={popup.active} type={popup.type}>{popup.content}</Popup>
        </form>
    )
}

export default PostForm