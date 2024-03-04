import { useState } from "react";
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import Input from "../input/Input";
import capitalizeWord from "../../utils/capitalizeWord";
import { MdClose } from "react-icons/md";
import axiosClient from "../../axiosClient";

interface Props {
    facebook: string | null,
    instagram: string | null,
    twitter: string | null,
    setSettings: React.Dispatch<React.SetStateAction<UserSettings | null>>
    setPopup: React.Dispatch<React.SetStateAction<Popup>>
    setError: React.Dispatch<React.SetStateAction<boolean>>
}

const SocialMediaForm = ({ facebook, instagram, twitter, setSettings, setPopup, setError }: Props) => {
    const [activeField, setActiveField] = useState<'facebook' | 'instagram' | 'twitter' | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const input = form.querySelector('input') as HTMLInputElement;
        const data: { facebook?: string, instagram?: string, twitter?: string } = {};
        switch (activeField) {
            case 'facebook':
                data.facebook = input.value;
                break;
            case 'instagram':
                data.instagram = input.value;
                break;
            case 'twitter':
                data.twitter = input.value;
                break;
        }
        try {
            await axiosClient({
                method: 'put',
                url: '/update-settings',
                data
            });
            setSettings(prev => {
                if (!prev) return prev;
                switch (activeField) {
                    case 'facebook':
                        return { ...prev, facebook: input.value };
                        break;
                    case 'instagram':
                        return { ...prev, instagram: input.value };
                        break;
                    case 'twitter':
                        return { ...prev, twitter: input.value };
                        break;
                    default:
                        return prev;
                }
            });
            setActiveField(null);
            setPopup({ content: 'Zaktualizowano informacje', active: true, type: 'good' });
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
        <section className="flex items-center gap-6 flex-wrap">
            <button data-testid='socialMediaButton' onClick={() => setActiveField('facebook')} className={`text-8xl max-sm:text-7xl ${facebook ? 'text-primary' : 'text-black65'}`} title="Edytuj Facebooka">
                <FaFacebook />
            </button>
            <button data-testid='socialMediaButton' onClick={() => setActiveField('instagram')} className={`text-8xl max-sm:text-7xl ${instagram ? 'text-primary' : 'text-black65'}`} title="Edytuj Instagrama">
                <FaInstagram />
            </button>
            <button data-testid='socialMediaButton' onClick={() => setActiveField('twitter')} className={`text-8xl max-sm:text-7xl ${twitter ? 'text-primary' : 'text-black65'}`} title="Edytuj Twittera">
                <FaSquareXTwitter />
            </button>
            {
                activeField &&
                <>
                    <div className="fixed inset-0 bg-overlayBlack"></div>
                    <form data-testid='socialMediaForm' onSubmit={handleSubmit} className="fixed flex flex-col items-center gap-5 top-1/2 -translate-y-1/2 left-1/2 transform -translate-x-1/2 w-[50em] max-w-[95%] bg-white border-[3px] rounded-2xl border-primary px-6 py-4 pt-8">
                        <p className="text-5xl max-sm:text-4xl font-bold">Ustaw link</p>
                        <Input
                            label={capitalizeWord(activeField)}
                            type="text"
                            maxLength={500}
                            required
                        />
                        <button className="text-3xl max-sm:text-2xl text-white bg-primary hover:bg-primaryHover transition-primary px-7 py-3 font-medium rounded-full">Zapisz</button>
                        <button type="button" onClick={() => setActiveField(null)} className="text-5xl text-red-600 absolute right-1 top-1" title="Zamknij okno">
                            <MdClose />
                        </button>
                    </form>
                </>
            }
        </section>
    )
}

export default SocialMediaForm
