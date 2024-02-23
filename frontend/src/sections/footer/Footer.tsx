import { Link } from "react-router-dom"
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';


const Footer = () => {
    return (
        <footer className="mt-20 px-10 max-sm:px-6 py-6 border-t-[3px] border-t-black flex flex-col items-center gap-8 text-center">
            <nav className="flex items-center justify-center gap-12 flex-wrap">
                <img className="w-[85px] max-sm:w-[60px]" src="/logo.png" alt="logo Substantia" />
                <div className="flex items-center justify-center gap-6 flex-wrap">
                    <Link title="Facebook" to='#' target="_blank">
                        <FaFacebook className="text-7xl max-sm:text-6xl text-primary hover:text-primaryHover transition-primary" />
                    </Link>
                    <Link title="Instagram" to='#' target="_blank">
                        <FaInstagram className="text-7xl max-sm:text-6xl text-primary hover:text-primaryHover transition-primary" />
                    </Link>
                    <Link title="Twitter" to='#' target="_blank">
                        <FaSquareXTwitter className="text-7xl max-sm:text-6xl text-primary hover:text-primaryHover transition-primary" />
                    </Link>
                </div>
            </nav>
            <nav className="flex items-center justify-center gap-10 flex-wrap">
                <Link data-testid='footerNavLink' className="text-4xl max-sm:text-3xl text-black65" to='#'>Polityka prywatności</Link>
                <Link data-testid='footerNavLink' className="text-4xl max-sm:text-3xl text-black65" to='#'>Regulamin serwisu</Link>
                <a data-testid='footerNavLink' className="text-4xl max-sm:text-3xl text-black65" href="mailto:support@substantia.pl">Kontakt</a>
            </nav>
            <p className="text-4xl max-sm:text-3xl text-black65 font-bold">2024 &copy; Substantia Wszystkie prawa zastrzeżone</p>
        </footer>
    )
}

export default Footer
