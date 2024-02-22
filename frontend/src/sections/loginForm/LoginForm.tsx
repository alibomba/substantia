import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import Input from "../../components/input/Input"
import { AuthContext } from "../../contexts/AuthProvider";
import Error from "../../components/error/Error";
import axiosClient from "../../axiosClient";
import ForgotPassword from "../../components/forgotPassword/ForgotPassword";


const LoginForm = () => {
    const navigate = useNavigate();
    const { setIsAuthorized, setPayload } = useContext<MyAuthContext>(AuthContext);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);

    async function login(e: React.FormEvent) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = form.querySelector('#email') as HTMLInputElement;
        const password = form.querySelector('#password') as HTMLInputElement;
        try {
            const { data } = await axiosClient({
                method: 'post',
                url: '/login',
                data: {
                    email: email.value,
                    password: password.value
                }
            });
            const { accessToken, refreshToken, payload } = data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            setPayload(payload);
            setIsAuthorized(true);
            navigate('/feed');
        } catch (err: any) {
            if (err?.response?.status === 401) {
                setLoginError(err?.response?.data?.message);
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
        <form onSubmit={login} className="flex flex-col items-center gap-8 py-5 px-10 max-[860px]:px-4">
            <Input
                id="email"
                type="email"
                label="E-mail"
                maxLength={20}
                required
            />
            <Input
                id="password"
                type="password"
                label="Hasło"
                minLength={8}
                maxLength={60}
                required
            />
            {
                loginError && <p data-testid='loginError' role="alert" aria-live="assertive" className="text-4xl max-sm:text-2xl text-red-500 font-medium text-center">{loginError}</p>
            }
            <ForgotPassword />
            <button className="text-4xl max-sm:text-3xl text-white text-center bg-primary hover:bg-primaryHover transition-primary w-full px-5 py-3 font-medium rounded-full">Zaloguj się</button>
            <div className="self-start">
                <p className="mb-2 flex items-center flex-wrap gap-2 text-4xl max-sm:text-3xl font-medium">
                    <span>Nie masz konta?</span>
                    <Link className="text-primary" to='/rejestracja'>Zarejestruj się</Link>
                </p>
                <Link className="text-4xl max-sm:text-3xl text-primary font-medium" to='/'>Strona główna</Link>
            </div>
        </form>
    )
}

export default LoginForm
