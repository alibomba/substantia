import { useEffect, useState } from "react"
import Loading from "../../components/loading/Loading";
import Error from "../../components/error/Error";
import axios from "axios";
import axiosClient from "../../axiosClient";
import AvatarForm from "../../components/avatarForm/AvatarForm";
import Popup from "../../components/popup/Popup";
import BannerForm from "../../components/bannerForm/BannerForm";
import ProfileVideoForm from "../../components/profileVideoForm/ProfileVideoForm";
import CreateChannel from "../../components/createChannel/CreateChannel";
import UsernameSlugForm from "../../components/usernameSlugForm/UsernameSlugForm";
import SocialMediaForm from "../../components/socialMediaForm/SocialMediaForm";
import DescriptionForm from "../../components/descriptionForm/DescriptionForm";
import EmailForm from "../../components/emailForm/EmailForm";
import PasswordForm from "../../components/passwordForm/PasswordForm";

const Settings = () => {
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [popup, setPopup] = useState<Popup>({ content: null, active: false, type: 'good' });

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function fetchData() {
            try {
                const { data } = await axiosClient({
                    method: 'get',
                    url: '/my-settings',
                    cancelToken: source.token
                });
                setSettings(data);
            } catch (err) {
                setError(true);
            }
            setIsLoading(false);
        }

        fetchData();
        return () => {
            source.cancel();
        }
    }, []);

    if (isLoading || !settings) {
        return <Loading />
    }

    if (error) {
        return <Error />
    }

    return (
        <main className="px-8 max-sm:px-4 py-5 max-sm:py-3 flex flex-col items-start gap-8">
            <AvatarForm
                avatar={settings.avatar}
                setSettings={setSettings}
                setPopup={setPopup}
                setError={setError}
            />
            {
                settings.hasChannel ?
                    <>
                        <BannerForm
                            banner={settings.banner!}
                            setSettings={setSettings}
                            setError={setError}
                            setPopup={setPopup}
                        />
                        <ProfileVideoForm
                            setError={setError}
                            setPopup={setPopup}
                        />
                    </>
                    :
                    <CreateChannel
                        setError={setError}
                        setPopup={setPopup}
                    />
            }
            <UsernameSlugForm
                username={settings.username}
                slug={settings.slug}
                setSettings={setSettings}
                setError={setError}
                setPopup={setPopup}
            />
            {
                settings.hasChannel &&
                <>
                    <SocialMediaForm
                        facebook={settings.facebook}
                        instagram={settings.instagram}
                        twitter={settings.twitter}
                        setSettings={setSettings}
                        setError={setError}
                        setPopup={setPopup}
                    />
                    <DescriptionForm
                        description={settings.description!}
                        setSettings={setSettings}
                        setError={setError}
                        setPopup={setPopup}
                    />
                </>
            }
            <EmailForm
                email={settings.email}
                setSettings={setSettings}
                setError={setError}
                setPopup={setPopup}
            />
            <PasswordForm
                setError={setError}
                setPopup={setPopup}
            />
            <Popup active={popup.active} type={popup.type}>{popup.content}</Popup>
        </main>
    )
}

export default Settings
