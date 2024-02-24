import { useContext } from 'react';
import { FaFaceFrown } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider';

const NotFound = () => {
    const { isAuthorized } = useContext<MyAuthContext>(AuthContext);

    return (
        <div className="flex flex-col items-center text-center gap-6 mt-40 px-4">
            <h1 className="text-8xl max-md:text-7xl max-[480px]:text-5xl font-bold text-primary">Nie znaleziono strony</h1>
            <FaFaceFrown data-testid='icon' className='text-9xl max-md:text-8xl max-[480px]:text-6xl text-primary' />
            <Link className='text-6xl max-md:text-5xl max-[480px]:text-3xl text-white font-medium bg-primary hover:bg-primaryHover transition-primary px-8 py-4 rounded-full' to={isAuthorized ? '/feed' : '/'}>Strona główna</Link>
        </div>
    )
}

export default NotFound
