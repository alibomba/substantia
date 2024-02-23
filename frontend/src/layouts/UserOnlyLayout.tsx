import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Footer, Header } from "../sections";
import { AuthContext } from "../contexts/AuthProvider";
import Loading from "../components/loading/Loading";

const UserOnlyLayout = () => {
    const { isAuthorized, isLoading } = useContext<MyAuthContext>(AuthContext);

    if (isLoading) {
        return <Loading />
    }

    if (!isLoading && !isAuthorized) {
        return <Navigate to='/logowanie' />
    }

    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}

export default UserOnlyLayout
