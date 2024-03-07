import { MdClose } from "react-icons/md"
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';


interface Props {
    images: PostImage[]
    currentImage: number
    setFullScreenPhoto: React.Dispatch<React.SetStateAction<number | null>>
}

const FullScreenPhoto = ({ images, currentImage, setFullScreenPhoto }: Props) => {

    function previousPhoto() {
        if (currentImage !== 0) {
            setFullScreenPhoto(currentImage - 1);
        } else {
            setFullScreenPhoto(images.length - 1);
        }
    }

    function nextPhoto() {
        if (currentImage !== images.length - 1) {
            setFullScreenPhoto(currentImage + 1);
        }
        else {
            setFullScreenPhoto(0);
        }
    }

    return (
        <>
            <div className="fixed inset-0 bg-overlayBlack z-[999]"></div>
            <img className="fixed inset-0 w-[100%] h-[100%] z-[1000] object-contain" src={images[currentImage].path} alt="pełnoekranowe zdjęcie" />
            <button className="fixed top-3 right-3 text-5xl text-red-500 z-[1001] w-[1.5em] h-[1.5em] flex items-center justify-center rounded-full bg-white hover:bg-gray-200 transition-primary" onClick={() => setFullScreenPhoto(null)} title="Zamknij pełny ekran">
                <MdClose />
            </button>
            {
                images.length > 1 &&
                <>
                    <button onClick={previousPhoto} className="fixed left-3 top-1/2 transform -translate-y-1/2 text-5xl text-black65 z-[1001] w-[1.5em] h-[1.5em] flex items-center justify-center rounded-full bg-white hover:bg-gray-200 transition-primary" title="Poprzednie zdjęcie">
                        <FaArrowAltCircleLeft />
                    </button>
                    <button onClick={nextPhoto} className="fixed right-3 top-1/2 transform -translate-y-1/2 text-5xl text-black65 z-[1001] w-[1.5em] h-[1.5em] flex items-center justify-center rounded-full bg-white hover:bg-gray-200 transition-primary" title="Następne zdjęcie">
                        <FaArrowAltCircleRight />
                    </button>
                </>
            }
        </>
    )
}

export default FullScreenPhoto
