import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { Footer, Header } from "../sections";
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
            <Footer />
        </>
    )
}

export default DefaultLayout
