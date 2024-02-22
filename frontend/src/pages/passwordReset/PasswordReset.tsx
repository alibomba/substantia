import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../components/input/Input";
import Popup from "../../components/popup/Popup";
import Error from "../../components/error/Error";
import axiosClient from "../../axiosClient";

const PasswordReset = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const [popup, setPopup] = useState<Popup>({ content: null, active: false, type: 'good' });
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        if (!token) navigate('/logowanie');
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const password = form.querySelector('#password') as HTMLInputElement;
        const passwordConfirmation = form.querySelector('#passwordConfirmation') as HTMLInputElement;
        if (password.value !== passwordConfirmation.value) {
            setPopup({ content: 'Hasła nie są identyczne', active: true, type: 'bad' });
            setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
            return;
        }
        try {
            await axiosClient({
                method: 'post',
                url: `/password-reset/${token}`,
                data: {
                    newPassword: password.value
                }
            });
            navigate('/logowanie');
        } catch (err: any) {
            if (err?.response?.status === 401 || err?.response?.status === 422) {
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
        <form onSubmit={handleSubmit} className="px-10 max-sm:px-5 pt-32 flex flex-col items-center justify-center gap-4">
            <Input
                id="password"
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
            <button className="text-4xl max-sm:text-3xl text-white bg-primary hover:bg-primaryHover transition-primary px-6 py-3 rounded-full">Zapisz</button>
            <Popup active={popup.active} type={popup.type}>{popup.content}</Popup>
        </form>
    )
}

export default PasswordReset
