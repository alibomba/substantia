import { useNavigate } from 'react-router-dom';
import { IoLogoGoogle } from 'react-icons/io';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthProvider';
import Popup from '../popup/Popup';
import axiosClient from '../../axiosClient';
import Error from '../error/Error';

interface Props {
    text: string
}



const GoogleLogin = ({ text }: Props) => {
    const navigate = useNavigate();
    const { setIsAuthorized, setPayload } = useContext<MyAuthContext>(AuthContext);
    const [popup, setPopup] = useState<Popup>({ active: false, type: 'good', content: null });
    const [error, setError] = useState<boolean>(false);

    async function handleCallbackResponse(response: any) {
        const token = response.credential;
        try {
            const { data } = await axiosClient({
                method: 'post',
                url: '/google-login',
                data: {
                    token
                }
            });
            const { accessToken, refreshToken } = data;
            setIsAuthorized(true);
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            navigate('/feed');
        } catch (err: any) {
            if (err?.response?.status === 422 || err?.response?.status === 401) {
                setPopup({ content: err?.response?.data?.message, active: true, type: 'bad' });
                setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
            }
            else {
                setError(true);
            }
        }
    }

    useEffect(() => {
        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleCallbackResponse
        });

        function createFakeGoogleWrapper() {
            const googleLoginWrapper = document.querySelector('#googleLoginButton') as HTMLDivElement;
            googleLoginWrapper.style.display = 'none';
            window.google.accounts.id.renderButton(
                googleLoginWrapper,
                { type: 'icon', width: '200' }
            )
            const googleLoginWrapperButton = googleLoginWrapper.querySelector('div[role="button"]') as HTMLDivElement;
            return {
                click: () => {
                    googleLoginWrapperButton.click()
                }
            }
        }

        const googleButtonWrapper = createFakeGoogleWrapper();
        window.handleGoogleLogin = () => {
            googleButtonWrapper.click();
        }

    }, []);

    if (error) {
        return <Error />
    }

    return (
        <>
            <div id="googleLoginButton"></div>
            <button className="text-3xl max-[460px]:text-2xl font-medium flex items-center gap-3 px-6 py-1.5 border-[3px] border-primary" onClick={window.handleGoogleLogin}><IoLogoGoogle className='text-primary text-4xl max-[460px]:text-3xl' />{text}</button>
            <Popup active={popup.active} type={popup.type}>{popup.content}</Popup>
        </>
    )
}

export default GoogleLogin
