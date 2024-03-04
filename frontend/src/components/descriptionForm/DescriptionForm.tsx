import axiosClient from "../../axiosClient"


interface Props {
    description: string
    setSettings: React.Dispatch<React.SetStateAction<UserSettings | null>>
    setPopup: React.Dispatch<React.SetStateAction<Popup>>
    setError: React.Dispatch<React.SetStateAction<boolean>>
}

const DescriptionForm = ({ description, setSettings, setPopup, setError }: Props) => {

    function handleChange(e: React.ChangeEvent) {
        const input = e.target as HTMLTextAreaElement;
        setSettings(prev => {
            if (!prev) return prev;
            return { ...prev, description: input.value };
        })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!description) return;
        try {
            await axiosClient({
                method: 'put',
                url: '/update-settings',
                data: {
                    description
                }
            });
            setPopup({ content: 'Zaktualizowano opis profilu', active: true, type: 'good' });
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
        <form onSubmit={handleSubmit} className="flex items-center gap-4 flex-wrap max-sm:flex-col max-sm:items-start">
            <textarea value={description} onChange={handleChange} className="text-4xl max-sm:text-3xl max-[530px]:w-full border-2 border-primary rounded-xl resize-none p-2" aria-label='Opis profilu' placeholder="Opis profilu" cols={30} rows={5}></textarea>
            <button className="text-4xl max-sm:text-3xl text-white font-medium bg-primary hover:bg-primaryHover transition-primary px-8 py-3 rounded-full">Zapisz</button>
        </form>
    )
}

export default DescriptionForm
