import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../sections";
import { AuthContext } from "../contexts/AuthProvider";
import Loading from "../components/loading/Loading";

const DefaultLayout = () => {
    const { isLoading } = useContext<MyAuthContext>(AuthContext);

    if (isLoading) {
        return <Loading />
    }

    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default DefaultLayout
