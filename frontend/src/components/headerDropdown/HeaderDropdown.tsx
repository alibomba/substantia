import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthProvider";
import { IoMdClose } from 'react-icons/io';
import axiosClient from "../../axiosClient";
import Error from "../error/Error";

interface Props {
    setState: React.Dispatch<React.SetStateAction<boolean>>
}

const HeaderDropdown = ({ setState }: Props) => {
    const navigate = useNavigate();
    const { payload, setIsAuthorized, setPayload } = useContext<MyAuthContext>(AuthContext);
    const [error, setError] = useState<boolean>(false);

    async function logout() {
        try {
            await axiosClient({
                method: 'post',
                url: '/logout',
                data: {
                    refreshToken: localStorage.getItem('refreshToken')
                }
            });
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setIsAuthorized(false);
            setPayload({ id: '', email: '', slug: '', username: '', avatar: null, hasChannel: false });
            navigate('/logowanie');
        } catch (err) {
            setError(true);
        }
    }

    if (error) {
        return <Error />
    }

    return (
        <div className="absolute right-0 top-[110%] bg-white flex flex-col items-center gap-3 text-2xl font-medium p-4 pt-5 border-2 border-black rounded-2xl shadow-xl">
            <Link to={`/profil/${payload.id}`}>Mój profil</Link>
            <Link to='/zapisane'>Zapisane</Link>
            <Link to='/ustawienia'>Ustawienia</Link>
            <button onClick={logout}>Wyloguj</button>
            <button onClick={() => setState(false)} title="Zamknij menu profilu" className="absolute top-0 right-0">
                <IoMdClose className="text-red-500 text-3xl" />
            </button>
        </div>
    )
}

export default HeaderDropdown
