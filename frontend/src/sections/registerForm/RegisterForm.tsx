import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/input/Input";
import Error from "../../components/error/Error";
import Popup from "../../components/popup/Popup";
import axiosClient from "../../axiosClient";

const RegisterForm = () => {
    const [formData, setFormData] = useState<RegisterForm>({ email: '', username: '', slug: '', password: '', passwordConfirmation: '' });
    const [popup, setPopup] = useState<Popup>({ content: null, active: false, type: 'good' });
    const [error, setError] = useState<boolean>(false);

    function handleChange(e: React.ChangeEvent) {
        const input = e.target as HTMLInputElement;
        const label = input.ariaLabel;
        setFormData(prev => {
            switch (label) {
                case 'E-mail':
                    return { ...prev, email: input.value };
                    break;
                case 'Nazwa':
                    return { ...prev, username: input.value };
                    break;
                case 'Identyfikator':
                    return { ...prev, slug: input.value };
                    break;
                case 'Hasło':
                    return { ...prev, password: input.value };
                    break;
                case 'Powtórz hasło':
                    return { ...prev, passwordConfirmation: input.value };
                    break;
            }
            return prev;
        });
    }

    async function register(e: React.FormEvent) {
        e.preventDefault();
        if (formData.password !== formData.passwordConfirmation) {
            setPopup({ content: 'Hasła nie są identyczne', active: true, type: 'bad' });
            setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
            return;
        }
        try {
            await axiosClient({
                method: 'post',
                url: '/register',
                data: {
                    email: formData.email,
                    username: formData.username,
                    slug: formData.slug,
                    password: formData.password
                }
            });
            setFormData({ email: '', username: '', slug: '', password: '', passwordConfirmation: '' });
            setPopup({ content: 'Utworzono konto', active: true, type: 'good' });
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

    if (error) {
        return <Error />
    }

    return (
        <form onSubmit={register} className="flex flex-col items-center gap-8 py-5 px-10 max-[860px]:px-4">
            <Input
                type="email"
                label="E-mail"
                maxLength={20}
                required
                onChange={handleChange}
                value={formData.email}
            />
            <Input
                type="text"
                label="Nazwa"
                maxLength={20}
                required
                onChange={handleChange}
                value={formData.username}
            />
            <Input
                type="text"
                label="Identyfikator"
                maxLength={20}
                required
                onChange={handleChange}
                value={formData.slug}
            />
            <Input
                type="password"
                label="Hasło"
                minLength={8}
                maxLength={60}
                required
                onChange={handleChange}
                value={formData.password}
            />
            <Input
                type="password"
                label="Powtórz hasło"
                minLength={8}
                maxLength={60}
                required
                onChange={handleChange}
                value={formData.passwordConfirmation}
            />
            <button className="text-4xl max-sm:text-3xl text-white text-center bg-primary hover:bg-primaryHover transition-primary w-full px-5 py-3 font-medium rounded-full">Zarejestruj się</button>
            <div className="self-start">
                <p className="mb-2 flex items-center flex-wrap gap-2 text-4xl max-sm:text-3xl font-medium">
                    <span>Masz już konto?</span>
                    <Link className="text-primary" to='/logowanie'>Zaloguj się</Link>
                </p>
                <Link className="text-4xl max-sm:text-3xl text-primary font-medium" to='/'>Strona główna</Link>
            </div>
            <Popup active={popup.active} type={popup.type}>{popup.content}</Popup>
        </form>
    )
}

export default RegisterForm
