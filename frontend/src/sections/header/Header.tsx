import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { Link } from "react-router-dom";
import { FaSearch } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import HeaderDropdown from "../../components/headerDropdown/HeaderDropdown";


const Header = () => {
    const { isAuthorized, payload } = useContext<MyAuthContext>(AuthContext);
    const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false);

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
            <header className="mobileNav:hidden">
                <div className="flex items-center justify-between gap-3 px-8 py-3">
                    <Link to={isAuthorized ? '/feed' : '/'}>
                        <img className="h-20" src="/text-logo.png" alt="logo Substantia" />
                    </Link>
                    <button className="text-5xl" title="Otwórz menu nawigacji">
                        <GiHamburgerMenu />
                    </button>
                </div>
                <nav>

                </nav>
            </header>
        </>
    )
}

export default Header
