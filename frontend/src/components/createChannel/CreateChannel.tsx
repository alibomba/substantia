import { useState } from "react"
import { MdClose } from "react-icons/md";
import { FaImage, FaVideo } from 'react-icons/fa';
import axiosClient from "../../axiosClient";

interface Props {
    setPopup: React.Dispatch<React.SetStateAction<Popup>>
    setError: React.Dispatch<React.SetStateAction<boolean>>
}

interface CreateChannelData {
    banner: File | null,
    profileVideo: File | null,
    description: string,
    subscriptionPrice: string
}

const CreateChannel = ({ setPopup, setError }: Props) => {
    const [isModalActive, setIsModalActive] = useState<boolean>(false);
    const [data, setData] = useState<CreateChannelData>({ banner: null, profileVideo: null, description: '', subscriptionPrice: '' });
    const [stage, setStage] = useState<number>(1);

    async function handleButtonClick() {
        if (stage !== 4) {
            setStage(prev => prev + 1);
        }
        else {
            const formData = new FormData();
            formData.append('banner', data.banner || '');
            formData.append('profileVideo', data.profileVideo || '');
            formData.append('description', data.description);
            formData.append('subscriptionPrice', data.subscriptionPrice);
            try {
                await axiosClient({
                    method: 'post',
                    url: '/create-channel',
                    data: formData,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                setStage(1);
                setIsModalActive(false);
                setPopup({ content: 'Odśwież stronę', active: true, type: 'good' });
                setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
            } catch (err: any) {
                if (err?.response?.status === 422) {
                    setIsModalActive(false);
                    setStage(1);
                    setPopup({ content: err?.response?.data?.message, active: true, type: 'bad' });
                    setTimeout(() => setPopup(prev => ({ ...prev, active: false })), 4000);
                }
                else {
                    setError(true);
                }
            }
        }
    }

    function changeBanner(e: React.ChangeEvent) {
        const input = e.target as HTMLInputElement;
        const banner = input.files?.[0];
        if (!banner) return;
        setData(prev => ({ ...prev, banner }));
        setStage(2);
    }

    function changeProfileVideo(e: React.ChangeEvent) {
        const input = e.target as HTMLInputElement;
        const video = input.files?.[0];
        if (!video) return;
        setData(prev => ({ ...prev, profileVideo: video }));
        setStage(3);
    }

    function changeDescription(e: React.ChangeEvent) {
        const input = e.target as HTMLTextAreaElement;
        setData(prev => ({ ...prev, description: input.value }));
    }

    function changeSubscriptionPrice(e: React.ChangeEvent) {
        const input = e.target as HTMLInputElement;
        setData(prev => ({ ...prev, subscriptionPrice: input.value }));
    }

    function handleClose() {
        setIsModalActive(false);
        setStage(1);
    }

    return (
        <>
            <button onClick={() => setIsModalActive(true)} className="text-5xl max-sm:text-4xl font-medium text-white bg-primary hover:bg-primaryHover transition-primary px-7 py-3 rounded-full">Utwórz kanał</button>
            {
                isModalActive &&
                <>
                    <div className="fixed inset-0 bg-overlayBlack"></div>
                    <form data-testid='createChannelForm' className="fixed flex flex-col items-center gap-6 top-1/2 -translate-y-1/2 w-[50em] left-1/2 transform -translate-x-1/2 max-w-[95%] bg-white border-[3px] rounded-2xl border-primary px-6 py-4 pt-8">
                        <button type="button" onClick={handleClose} className="text-5xl text-red-600 absolute right-1 top-1" title="Zamknij okno">
                            <MdClose />
                        </button>
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <div className="flex max-[360px]:flex-col items-center justify-center gap-3">
                                <p className={`text-3xl max-sm:text-2xl text-white ${stage === 1 ? 'bg-primary' : 'bg-black65'} w-[2em] h-[2em] flex items-center justify-center rounded-full font-bold`}>1</p>
                                <p className="text-3xl max-sm:text-2xl font-bold">Banner</p>
                            </div>
                            <div className="flex max-[360px]:flex-col items-center justify-center gap-3">
                                <p className={`text-3xl max-sm:text-2xl text-white ${stage === 2 ? 'bg-primary' : 'bg-black65'} w-[2em] h-[2em] flex items-center justify-center rounded-full font-bold`}>2</p>
                                <p className="text-3xl max-sm:text-2xl font-bold">Filmik profilowy</p>
                            </div>
                            <div className="flex max-[360px]:flex-col items-center justify-center gap-3">
                                <p className={`text-3xl max-sm:text-2xl text-white ${stage === 3 ? 'bg-primary' : 'bg-black65'} w-[2em] h-[2em] flex items-center justify-center rounded-full font-bold`}>3</p>
                                <p className="text-3xl max-sm:text-2xl font-bold">Opis profilu</p>
                            </div>
                            <div className="flex max-[360px]:flex-col items-center justify-center gap-3">
                                <p className={`text-3xl max-sm:text-2xl text-white ${stage === 4 ? 'bg-primary' : 'bg-black65'} w-[2em] h-[2em] flex items-center justify-center rounded-full font-bold`}>4</p>
                                <p className="text-3xl max-sm:text-2xl font-bold">Cena subskrypcji</p>
                            </div>
                        </div>
                        {
                            stage === 1 &&
                            <>
                                <label className="text-6xl p-6 text-primary cursor-pointer border-4 border-primary rounded-xl" title="Dodaj banner" htmlFor="banner">
                                    <FaImage />
                                </label>
                                <input onChange={changeBanner} type="file" id="banner" style={{ display: 'none' }} />
                            </>
                        }
                        {
                            stage === 2 &&
                            <>
                                <label className="text-6xl p-6 text-primary cursor-pointer border-4 border-primary rounded-xl" title="Dodaj filmik profilowy" htmlFor="profileVideo">
                                    <FaVideo />
                                </label>
                                <input onChange={changeProfileVideo} type="file" id="profileVideo" style={{ display: 'none' }} />
                            </>
                        }
                        {
                            stage === 3 &&
                            <textarea onChange={changeDescription} value={data.description} maxLength={200} className="text-3xl max-sm:text-2xl max-sm:w-full border-2 border-primary rounded-xl resize-none p-2" placeholder="Opis profilu" aria-label='Opis profilu' cols={30} rows={5}></textarea>
                        }
                        {
                            stage === 4 &&
                            <input aria-label="Cena subskrypcji" placeholder="Cena subskrypcji" className="w-1/2 max-sm:w-full text-3xl border-2 border-primary rounded-xl p-2" type="number" step={0.01} min={1} max={200} value={data.subscriptionPrice} onChange={changeSubscriptionPrice} />
                        }
                        {
                            (stage !== 1 && stage !== 2) &&
                            <button onClick={handleButtonClick} className="text-3xl max-sm:text-2xl text-white bg-primary hover:bg-primaryHover transition-primary px-7 py-3 font-medium rounded-full" type="button">
                                {stage === 4 ? 'Zapisz' : 'Dalej'}
                            </button>
                        }
                    </form>
                </>
            }
        </>
    )
}

export default CreateChannel
