import { MdEdit } from "react-icons/md"
import axiosClient from "../../axiosClient"


interface Props {
    banner: string
    setSettings: React.Dispatch<React.SetStateAction<UserSettings | null>>
    setPopup: React.Dispatch<React.SetStateAction<Popup>>
    setError: React.Dispatch<React.SetStateAction<boolean>>
}

const BannerForm = ({ banner, setSettings, setError, setPopup }: Props) => {

    async function handleChange(e: React.ChangeEvent) {
        const input = e.target as HTMLInputElement;
        const banner = input.files?.[0];
        if (!banner) return;
        const formData = new FormData();
        formData.append('banner', banner);
        try {
            await axiosClient({
                method: 'put',
                url: '/update-banner',
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setPopup({ content: 'Zaktualizowano banner', active: true, type: 'good' });
            setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                setSettings(prev => {
                    if (!prev) return prev;
                    return { ...prev, banner: url };
                });
            }
            reader.readAsDataURL(banner);
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
            <div className="w-[550px] max-sm:w-full h-[110px] border-2 border-primary rounded-[20px] relative">
                <div className="bg-overlayBlack absolute inset-0 rounded-[20px]"></div>
                <img className="w-full h-full rounded-[20px] object-cover" src={banner} alt="banner użytkownika" />
                <label htmlFor="banner" className="absolute left-1/2 transform -translate-x-1/2 top-[20%] text-6xl text-primary cursor-pointer" title="Edytuj banner">
                    <MdEdit />
                </label>
                <input onChange={handleChange} type="file" id="banner" style={{ display: 'none' }} />
            </div>
            <p className="text-5xl max-sm:text-4xl font-medium">Zmień banner</p>
        </form>
    )
}

export default BannerForm
