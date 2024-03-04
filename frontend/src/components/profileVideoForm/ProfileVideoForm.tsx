import { FaVideo } from 'react-icons/fa';
import axiosClient from '../../axiosClient';

interface Props {
    setPopup: React.Dispatch<React.SetStateAction<Popup>>
    setError: React.Dispatch<React.SetStateAction<boolean>>
}

const ProfileVideoForm = ({ setPopup, setError }: Props) => {

    async function handleChange(e: React.FormEvent) {
        const input = e.target as HTMLInputElement;
        const video = input.files?.[0];
        if (!video) return;
        const formData = new FormData();
        formData.append('profileVideo', video);
        try {
            await axiosClient({
                method: 'put',
                url: '/update-profile-video',
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total && progressEvent.loaded) {
                        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        if (percentage < 100) {
                            setPopup({ content: `Przesyłanie ${percentage}%`, active: true, type: 'good' });
                        }
                        else {
                            setPopup(prev => ({ ...prev, active: false }));
                        }
                    }
                }
            });
            setPopup({ content: 'Zaktualizowano filmik profilowy', active: true, type: 'good' });
            setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
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
        <div className='flex items-center gap-6 flex-wrap'>
            <label className='text-6xl px-6 py-4 text-primary border-4 border-primary rounded-xl cursor-pointer' htmlFor="profileVideo" title='Edytuj filmik profilowy'>
                <FaVideo />
            </label>
            <input onChange={handleChange} type="file" id='profileVideo' style={{ display: 'none' }} />
            <p className='text-5xl max-sm:text-4xl font-medium'>Zmień filmik profilowy</p>
        </div>
    )
}

export default ProfileVideoForm
