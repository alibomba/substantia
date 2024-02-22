import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import HeaderDropdown from "../../components/headerDropdown/HeaderDropdown";
import Error from "../../components/error/Error";
import axiosClient from "../../axiosClient";


const Header = () => {
    const navigate = useNavigate();
    const { isAuthorized, payload, setIsAuthorized, setPayload } = useContext<MyAuthContext>(AuthContext);
    const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false);
    const [isNavActive, setIsNavActive] = useState<boolean>(false);
    const [isNavHidden, setIsNavHidden] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    function toggleNav() {
        if (isNavActive) {
            setIsNavActive(false);
            setTimeout(() => setIsNavHidden(true), 210);
        }
        else {
            setIsNavHidden(false);
            setTimeout(() => setIsNavActive(true), 100);
        }
    }

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
        <>
            <header className="max-mobileNav:hidden flex items-center justify-between gap-4 px-8 py-3">
                <Link to={isAuthorized ? '/feed' : '/'}>
                    <img className="h-28" src="/text-logo.png" alt="logo Substantia" />
                </Link>
                <nav className={`flex items-center ${isAuthorized ? 'gap-8' : 'gap-4'}`}>
                    {
                        isAuthorized ?
                            <>
                                <Link className="text-4xl font-bold" to='/feed'>Home</Link>
                                <Link className="text-5xl text-primary hover:text-primaryHover transition-primary" to='/wyszukiwarka' title="Wyszukiwarka">
                                    <FaSearch />
                                </Link>
                                <div className="relative">
                                    <button onClick={() => setIsDropdownActive(true)} title="Otwórz menu profilu">
                                        <img className="w-16 h-16 object-cover rounded-full border-2 border-primary" src={payload.avatar ? payload.avatar : '/default.png'} alt="zdjęcie profilowe" />
                                    </button>
                                    {
                                        isDropdownActive && <HeaderDropdown setState={setIsDropdownActive} />
                                    }
                                </div>
                            </>
                            :
                            <>
                                <Link className="text-3xl text-primary font-medium border-[3px] border-primary px-6 py-2 rounded-full shadow-xl" to='/logowanie'>Zaloguj się</Link>
                                <Link className="text-3xl text-white bg-primary hover:bg-primaryHover transition-primary font-medium border-[3px] border-primary px-6 py-2 rounded-full shadow-xl" to='/rejestracja'>Załóż konto</Link>
                            </>
                    }
                </nav>
            </header>
            <header className="mobileNav:hidden relative">
                <div className="flex items-center justify-between gap-3 px-8 max-[500px]:px-5 py-3 max-[500px]:py-1">
                    <Link to={isAuthorized ? '/feed' : '/'}>
                        <img className="h-20" src="/text-logo.png" alt="logo Substantia" />
                    </Link>
                    <button onClick={toggleNav} className="text-5xl" title="Otwórz menu nawigacji">
                        <GiHamburgerMenu />
                    </button>
                </div>
                <nav className={`${isNavHidden && 'hidden'} ${isNavActive ? 'scale-y-1' : 'scale-y-0'} origin-top transition-primary absolute top-[100%] left-0 right-0 px-5 py-10 flex flex-col items-center gap-4 shadow-md z-50`}>
                    {
                        isAuthorized ?
                            <>
                                <Link className="text-3xl font-bold" to='/feed'>Home</Link>
                                <Link className="text-4xl text-primary hover:text-primaryHover transition-primary" to='/wyszukiwarka' title="Wyszukiwarka">
                                    <FaSearch />
                                </Link>
                                <Link className="text-3xl font-bold" to={`/profil/${payload.id}`}>Mój profil</Link>
                                <Link className="text-3xl font-bold" to='/zapisane'>Zapisane</Link>
                                <Link className="text-3xl font-bold" to='/ustawienia'>Ustawienia</Link>
                                <button onClick={logout} className="text-3xl font-bold">Wyloguj</button>
                            </>
                            :
                            <>
                                <Link className="text-2xl text-primary font-medium border-[3px] border-primary px-6 py-2 rounded-full shadow-xl" to='/logowanie'>Zaloguj się</Link>
                                <Link className="text-2xl text-white bg-primary hover:bg-primaryHover transition-primary font-medium border-[3px] border-primary px-6 py-2 rounded-full shadow-xl" to='/rejestracja'>Załóż konto</Link>
                            </>
                    }
                </nav>
            </header>
        </>
    )
}

export default Header
