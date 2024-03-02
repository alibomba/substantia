import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProfileHeader, UserPosts } from "../../sections";
import Loading from "../../components/loading/Loading";
import Error from "../../components/error/Error";
import axios from "axios";
import axiosClient from "../../axiosClient";
import { AuthContext } from "../../contexts/AuthProvider";

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { payload: { id: myID } } = useContext<MyAuthContext>(AuthContext);
    const [profile, setProfile] = useState<ProfilePreview | null>(null)
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function fetchData() {
            try {
                const { data } = await axiosClient({
                    method: 'get',
                    url: `/profile-preview/${id}`,
                    cancelToken: source.token
                });
                setProfile(data.profile);
                setIsSubscribed(data.isSubscribed);
            } catch (err: any) {
                if (err?.response?.status === 404) {
                    navigate('/404');
                }
                else {
                    setError(true);
                }
            }
            setIsLoading(false);
        }

        fetchData();

        return () => {
            source.cancel();
        }

    }, []);

    if (isLoading || !profile) {
        return <Loading />
    }

    if (error) {
        return <Error />
    }

    return (
        <main>
            <ProfileHeader setIsSubscribed={setIsSubscribed} profile={profile} isSubscribed={isSubscribed} />
            {
                (isSubscribed || myID === id) ?
                    <UserPosts id={id!} />
                    :
                    <section className="mt-20 px-12 max-sm:px-6 max-[450px]:px-3">
                        <h2 className="text-6xl max-md:text-5xl max-[450px]:text-4xl text-center font-bold">Komunikat od autora profilu</h2>
                        <video className="mt-12 max-sm:mt-6 w-[80%] max-md:w-full mx-auto rounded-[30px] max-[450px]:rounded-xl" src={profile.profileVideo} controls></video>
                    </section>
            }
        </main>
    )
}

export default Profile