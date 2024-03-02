import { useContext, useState } from "react"
import { AuthContext } from "../../contexts/AuthProvider"
import { useNavigate } from "react-router-dom"
import Error from "../error/Error"
import axiosClient from "../../axiosClient"
import Popup from "../popup/Popup"

interface Props {
    id: string
    isSubscribed: boolean
    setIsSubscribed: React.Dispatch<React.SetStateAction<boolean>>
    subscriptionPrice: number
}

const SubscribeButton = ({ id, isSubscribed, setIsSubscribed, subscriptionPrice }: Props) => {
    const navigate = useNavigate();
    const { isAuthorized } = useContext<MyAuthContext>(AuthContext);
    const [popup, setPopup] = useState<Popup>({ content: null, active: false, type: 'good' });
    const [error, setError] = useState<boolean>(false);

    async function subscribe() {
        if (!isAuthorized) {
            navigate('/logowanie');
            return;
        }
        if (!isSubscribed) {
            try {
                const { data } = await axiosClient({
                    method: 'post',
                    url: `/subscribe/${id}`
                });
                window.location = data.url;
            } catch (err) {
                setError(true);
            }
        }
        else {
            try {
                await axiosClient({
                    method: 'delete',
                    url: `/unsubscribe/${id}`
                });
                setIsSubscribed(false);
                setPopup({ content: 'Anulowano subskrypcję', active: true, type: 'good' });
                setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
            } catch (err) {
                setError(true);
            }
        }
    }

    if (error) {
        return <Error />
    }

    return (
        <>
            <button onClick={subscribe} className={`text-4xl max-sm:text-2xl text-white bg-primary hover:bg-primaryHover transition-primary ${!isSubscribed && 'w-[12em] max-[320px]:w-full'} max-[320px]:w-full flex items-center justify-between px-5 py-3 font-bold rounded-full`}>
                {
                    isSubscribed ? 'Anuluj subskrypcję' :
                        <>
                            <span>Subskrybuj</span>
                            <span>{(subscriptionPrice / 100).toFixed(2)}zł</span>
                        </>
                }
            </button>
            <Popup active={popup.active} type={popup.type}>{popup.content}</Popup>
        </>
    )
}

export default SubscribeButton
