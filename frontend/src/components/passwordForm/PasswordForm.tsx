import { useEffect, useState } from "react"
import Input from "../input/Input"
import axios from "axios"
import axiosClient from "../../axiosClient"


interface Props {
    setError: React.Dispatch<React.SetStateAction<boolean>>
    setPopup: React.Dispatch<React.SetStateAction<Popup>>
}

const PasswordForm = ({ setError, setPopup }: Props) => {
    const [hasOAuth, setHasOAuth] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function fetchData() {
            try {
                const { data } = await axiosClient({
                    method: 'get',
                    url: '/check-oauth',
                    cancelToken: source.token
                });
                setHasOAuth(data.hasOAuth);
            } catch (err) {
                setError(true);
            }
            setIsLoading(false);
        }

        fetchData();
        return () => {
            source.cancel();
        }
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const password = form.querySelector('#password') as HTMLInputElement;
        const newPassword = form.querySelector('#newPassword') as HTMLInputElement;
        const passwordConfirmation = form.querySelector('#passwordConfirmation') as HTMLInputElement;
        if (newPassword.value !== passwordConfirmation.value) {
            setPopup({ content: 'Hasła nie są identyczne', active: true, type: 'bad' });
            setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
            return;
        }
        try {
            await axiosClient({
                method: 'put',
                url: '/update-settings',
                data: {
                    password: newPassword.value,
                    oldPassword: password.value
                }
            });
            form.reset();
            setPopup({ content: 'Zaktualizowano hasło', active: true, type: 'good' });
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

    if (isLoading) {
        return <></>
    }

    if (!isLoading && hasOAuth) {
        return <div data-testid='noPasswordForm'></div>
    }

    return (
        <form data-testid='passwordForm' onSubmit={handleSubmit} className="flex items-center gap-4 max-[1460px]:flex-col max-[1460px]:items-start">
            <Input
                id="password"
                type="password"
                label="Hasło"
                minLength={8}
                maxLength={60}
                required
            />
            <Input
                id="newPassword"
                type="password"
                label="Nowe hasło"
                minLength={8}
                maxLength={60}
                required
            />
            <Input
                id="passwordConfirmation"
                type="password"
                label="Powtórz hasło"
                minLength={8}
                maxLength={60}
                required
            />
            <button className="text-4xl max-sm:text-3xl text-white font-medium bg-primary hover:bg-primaryHover transition-primary px-8 py-3 rounded-full">Zapisz</button>
        </form>
    )
}

export default PasswordForm
