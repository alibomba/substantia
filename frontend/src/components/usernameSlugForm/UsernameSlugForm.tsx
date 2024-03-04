import axiosClient from "../../axiosClient"
import Input from "../input/Input"


interface Props {
    username: string,
    slug: string,
    setSettings: React.Dispatch<React.SetStateAction<UserSettings | null>>
    setError: React.Dispatch<React.SetStateAction<boolean>>
    setPopup: React.Dispatch<React.SetStateAction<Popup>>
}

const UsernameSlugForm = ({ username, slug, setSettings, setError, setPopup }: Props) => {

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await axiosClient({
                method: 'put',
                url: '/update-settings',
                data: {
                    username,
                    slug
                }
            });
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

    function handleChange(e: React.ChangeEvent) {
        const input = e.target as HTMLInputElement;
        const label = input.ariaLabel;
        setSettings(prev => {
            if (!prev) return prev;
            switch (label) {
                case 'Nazwa użytk.':
                    return { ...prev, username: input.value };
                    break;
                case 'Identyfikator':
                    return { ...prev, slug: input.value };
                    break;
                default:
                    return prev;
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-4 max-md:flex-col max-md:items-start">
            <Input
                type="text"
                label="Nazwa użytk."
                value={username}
                onChange={handleChange}
                maxLength={20}
                required
            />
            <Input
                type="text"
                label="Identyfikator"
                value={slug}
                onChange={handleChange}
                maxLength={20}
                required
            />
            <button className="text-4xl max-sm:text-3xl text-white font-medium bg-primary hover:bg-primaryHover transition-primary px-8 py-3 rounded-full">Zapisz</button>
        </form>
    )
}

export default UsernameSlugForm
