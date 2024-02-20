import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoginForm, LoginRegisterHeader } from "../../sections"
import { AuthContext } from "../../contexts/AuthProvider";
import Loading from "../../components/loading/Loading";

const Login = () => {
    const { isAuthorized, isLoading } = useContext<MyAuthContext>(AuthContext);


    if (isLoading) {
        return <Loading />
    }

    if (!isLoading && isAuthorized) {
        return <Navigate to='/feed' />
    }

    return (
        <main data-testid='login' className="flex">
            <div className="w-3/5 max-[768px]:w-full">
                <LoginRegisterHeader
                    heading="Zaloguj się"
                    text="Twórz lub odbieraj tresci i ciesz sie rozrywka na najwyższym poziomie!"
                    buttonContent="Zaloguj się z Google"
                />
                <LoginForm />
            </div>
            <div style={{ backgroundImage: `url('${import.meta.env.VITE_BACKEND_URL}/storage/login-img.jpg')` }} className="w-2/5 h-[1020px] bg-cover max-[768px]:hidden"></div>
        </main>
    )
}

export default Login
