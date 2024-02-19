import { useContext } from "react";
import { LoginRegisterHeader } from "../../sections"
import RegisterForm from "../../sections/registerForm/RegisterForm"
import { AuthContext } from "../../contexts/AuthProvider";
import Loading from "../../components/loading/Loading";
import { Navigate } from "react-router-dom";

const Register = () => {
    const { isAuthorized, isLoading } = useContext<MyAuthContext>(AuthContext);

    if (isLoading) {
        return <Loading />
    }

    if (!isLoading && isAuthorized) {
        return <Navigate to='/feed' />
    }

    return (
        <main data-testid='register' className="flex">
            <div style={{ backgroundImage: `url('${import.meta.env.VITE_BACKEND_URL}/storage/register-img.jpg')` }} className="w-2/5 h-[1400px] bg-cover max-[768px]:hidden"></div>
            <div className="w-3/5 max-[768px]:w-full">
                <LoginRegisterHeader
                    heading="Zarejestruj się"
                    text="Zarejestruj się teraz, aby uzyskać dostęp do ekskluzywnych treści i dołączyć do naszej pasjonującej społeczności!"
                    buttonContent="Zarejestruj się z Google"
                />
                <RegisterForm />
            </div>
        </main>
    )
}

export default Register
