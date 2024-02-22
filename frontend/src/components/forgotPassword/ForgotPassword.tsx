import { useState } from "react";
import Input from "../input/Input";
import { IoMdClose } from 'react-icons/io';
import Popup from "../popup/Popup";
import Error from "../error/Error";
import axiosClient from "../../axiosClient";

const ForgotPassword = () => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [popup, setPopup] = useState<Popup>({ content: null, active: false, type: 'good' });
    const [error, setError] = useState<boolean>(false);

    function changeEmail(e: React.ChangeEvent) {
        const input = e.target as HTMLInputElement;
        setEmail(input.value);
    }

    async function handleSubmit() {
        if (!email) return;
        try {
            await axiosClient({
                method: 'post',
                url: '/password-reset',
                data: {
                    email
                }
            });
            setPopup({ content: 'Sprawdź swoją skrzynkę e-mail', active: true, type: 'good' });
            setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
            setIsActive(false);
            setEmail('');
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
        <>
            <button onClick={() => setIsActive(true)} className="text-3xl text-primary self-end font-medium" type="button">Nie pamiętam hasła</button>
            {
                isActive &&
                <>
                    <div data-testid='forgotPasswordModal' className="z-[1000] fixed top-52 left-1/2 transform -translate-x-1/2 w-[45em] max-md:w-[95%] h-80 rounded-3xl bg-white flex flex-col items-center gap-4 p-8">
                        <p className="text-4xl max-[500px]:text-3xl font-medium text-center">Podaj adres e-mail</p>
                        <Input
                            type="email"
                            label="E-mail"
                            value={email}
                            onChange={changeEmail}
                        />
                        <button type="button" onClick={handleSubmit} className="text-3xl max-[500px]:text-2xl text-white bg-primary hover:bg-primaryHover transition-primary font-medium px-7 py-3 rounded-full">Prześlij</button>
                        <button onClick={() => { setIsActive(false); setEmail(''); }} className="absolute top-1 right-1 text-5xl max-[500px]:text-4xl text-red-500" title="Zamknij okienko" type="button">
                            <IoMdClose />
                        </button>
                    </div>
                    <div className="fixed inset-0 z-[999] bg-overlayBlack"></div>
                </>
            }
            <Popup active={popup.active} type={popup.type}>{popup.content}</Popup>
        </>
    )
}

export default ForgotPassword
