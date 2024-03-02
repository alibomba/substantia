import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import SubscribeButton from '../../components/subscribeButton/SubscribeButton';
import ProfileStats from '../../components/profileStats/ProfileStats';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthProvider';

interface Props {
    profile: ProfilePreview
    isSubscribed: boolean
    setIsSubscribed: React.Dispatch<React.SetStateAction<boolean>>
}

const ProfileHeader = ({ profile: { id, banner, facebook, instagram, twitter, avatar, username, slug, description, subscriptionPrice }, isSubscribed, setIsSubscribed }: Props) => {
    const { payload: { id: myID } } = useContext<MyAuthContext>(AuthContext);

    return (
        <header>
            <img data-testid='banner' className="w-full h-[280px] object-cover" src={banner} alt="banner użytkownika" />
            <div className='px-12 max-sm:px-4 py-2 flex flex-col gap-3 items-start'>
                <div className="w-full h-[72px] max-sm:h-[48px] relative flex items-center justify-end gap-4 max-sm:gap-2">
                    <img data-testid='avatar' className='w-[10em] max-sm:w-[7em] h-[10em] max-sm:h-[7em] object-cover rounded-full border-2 border-primary absolute left-0 -top-[120%] max-sm:-top-[150%]' src={avatar ? avatar : '/default.png'} alt="zdjęcie profilowe użytkownika" />
                    {
                        facebook &&
                        <a className='text-7xl max-sm:text-5xl text-primary hover:text-primaryHover transition-primary' href={facebook} target='_blank' title="Facebook">
                            <FaFacebook />
                        </a>
                    }
                    {
                        instagram &&
                        <a className='text-7xl max-sm:text-5xl text-primary hover:text-primaryHover transition-primary' href={instagram} target='_blank' title="Instagram">
                            <FaInstagram />
                        </a>
                    }
                    {
                        twitter &&
                        <a className='text-7xl max-sm:text-5xl text-primary hover:text-primaryHover transition-primary' href={twitter} target='_blank' title="Twitter">
                            <FaSquareXTwitter />
                        </a>
                    }
                </div>
                <div className='flex flex-col items-start gap-2 max-sm:gap-1'>
                    <h1 className='text-5xl max-sm:text-4xl font-bold'>{username}</h1>
                    <p className='text-4xl max-sm:text-3xl font-medium text-black65'>@{slug}</p>
                </div>
                <p className='mt-3 max-sm:mt-2 text-3xl max-sm:text-2xl max-w-[70ch] text-black65 leading-relaxed max-sm:leading-relaxed'>{description}</p>
                <div className='mt-2 flex items-center gap-8 max-sm:gap-4 flex-wrap'>
                    {
                        myID !== id &&
                        <SubscribeButton
                            id={id}
                            subscriptionPrice={subscriptionPrice}
                            isSubscribed={isSubscribed}
                            setIsSubscribed={setIsSubscribed}
                        />
                    }
                    <ProfileStats id={id} />
                </div>
            </div>
        </header>
    )
}

export default ProfileHeader
