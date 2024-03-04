import axiosClient from "../../axiosClient"
import Input from "../input/Input"


interface Props {
    email: string
    setSettings: React.Dispatch<React.SetStateAction<UserSettings | null>>
    setError: React.Dispatch<React.SetStateAction<boolean>>
    setPopup: React.Dispatch<React.SetStateAction<Popup>>
}

const EmailForm = ({ email, setSettings, setError, setPopup }: Props) => {

    function handleChange(e: React.ChangeEvent) {
        const input = e.target as HTMLInputElement;
        setSettings(prev => {
            if (!prev) return prev;
            return { ...prev, email: input.value };
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await axiosClient({
                method: 'put',
                url: '/update-settings',
                data: {
                    email
                }
            });
            setPopup({ content: 'Zaktualizowano adres e-mail', active: true, type: 'good' });
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
        <form onSubmit={handleSubmit} className="flex items-center gap-4 max-md:flex-col max-md:items-start">
            <Input
                type="email"
                label="Adres e-mail"
                value={email}
                onChange={handleChange}
                maxLength={20}
                required
            />
            <button className="text-4xl max-sm:text-3xl text-white font-medium bg-primary hover:bg-primaryHover transition-primary px-8 py-3 rounded-full">Zapisz</button>
        </form>
    )
}

export default EmailForm
