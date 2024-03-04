import { MdEdit } from 'react-icons/md';
import axiosClient from '../../axiosClient';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthProvider';

interface Props {
    avatar: string | null
    setSettings: React.Dispatch<React.SetStateAction<UserSettings | null>>
    setPopup: React.Dispatch<React.SetStateAction<Popup>>
    setError: React.Dispatch<React.SetStateAction<boolean>>
}

const AvatarForm = ({ avatar, setSettings, setPopup, setError }: Props) => {
    const { setPayload } = useContext<MyAuthContext>(AuthContext);

    async function handleChange(e: React.ChangeEvent) {
        const input = e.target as HTMLInputElement;
        const avatar = input.files?.[0];
        if (!avatar) return;
        const formData = new FormData();
        formData.append('avatar', avatar);
        try {
            await axiosClient({
                method: 'put',
                url: '/update-avatar',
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setPopup({ content: 'Zaktualizowano avatar', active: true, type: 'good' });
            setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                setSettings(prev => {
                    if (!prev) return prev;
                    return { ...prev, avatar: url };
                });
                setPayload(prev => ({ ...prev, avatar: url }));
            }
            reader.readAsDataURL(avatar);
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

    return (
        <form className="flex items-center gap-6 flex-wrap">
            <div className="w-[130px] h-[130px] border-2 border-primary rounded-full relative">
                <div className='bg-overlayBlack absolute inset-0 rounded-full'></div>
                <img className="w-full h-full rounded-full object-cover" src={avatar ? avatar : '/default.png'} alt="zdjęcie profilowe" />
                <label htmlFor='avatar' className="absolute left-1/2 transform -translate-x-1/2 top-1/4 text-6xl text-primary cursor-pointer" title="Edytuj avatar">
                    <MdEdit />
                </label>
                <input onChange={handleChange} type="file" id='avatar' style={{ display: 'none' }} />
            </div>
            <p className='text-5xl max-sm:text-4xl font-medium'>Zmień avatar</p>
        </form>
    )
}

export default AvatarForm
