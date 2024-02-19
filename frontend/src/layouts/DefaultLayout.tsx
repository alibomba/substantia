import { Outlet } from "react-router-dom";
import { Header } from "../sections";

const DefaultLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default DefaultLayout
