import { useContext } from "react";
import { Link } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthProvider";
import { IoMdClose } from 'react-icons/io';

interface Props {
    setState: React.Dispatch<React.SetStateAction<boolean>>
}

const HeaderDropdown = ({ setState }: Props) => {
    const { payload } = useContext<MyAuthContext>(AuthContext);

    return (
        <div className="absolute right-0 top-[110%] flex flex-col items-center gap-3 text-2xl font-medium p-4 pt-5 border-2 border-black rounded-2xl">
            <Link to={`/profil/${payload.id}`}>Mój profil</Link>
            <Link to='/zapisane'>Zapisane</Link>
            <Link to='/ustawienia'>Ustawienia</Link>
            <button>Wyloguj</button>
            <button onClick={() => setState(false)} title="Zamknij menu profilu" className="absolute top-0 right-0">
                <IoMdClose className="text-red-500 text-3xl" />
            </button>
        </div>
    )
}

export default HeaderDropdown
