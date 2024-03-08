import { useState } from "react"
import { Link } from "react-router-dom"
import FullScreenPhoto from "../fullScreenPhoto/FullScreenPhoto";
import PostPoll from "../postPoll/PostPoll";
import PostStats from "../postStats/PostStats";
import PostComments from "../postComments/PostComments";


interface Props {
    post: Post
}

const Post = ({ post }: Props) => {
    const [fullScreenPhoto, setFullScreenPhoto] = useState<number | null>(null);
    const [areCommentsVisible, setAreCommentsVisible] = useState<boolean>(true);

    return (
        <>
            <div className={`p-2 w-full border-[3px] border-primary rounded-2xl ${areCommentsVisible && ' rounded-bl-none rounded-br-none'} flex flex-col gap-2`}>
                <div className="flex items-center gap-3">
                    <Link to={`/profil/${post.userId}`}>
                        <img className="w-[85px] max-sm:w-[70px] h-[85px] max-sm:h-[70px] object-cover rounded-full border-[3px] border-primary" src={post.user.avatar || '/default.png'} alt="avatar użytkownika" />
                    </Link>
                    <div className="flex flex-col items-start">
                        <h3 className="text-3xl font-bold"><Link to={`/profil/${post.userId}`}>{post.user.username}</Link></h3>
                        <p className="text-2xl text-black65 font-medium">@{post.user.slug}</p>
                    </div>
                </div>
                <p className="ml-[101px] max-sm:ml-0 max-sm:px-2 text-2xl text-black65 leading-relaxed">{post.content}</p>
                {
                    post.videoPath &&
                    <video className="ml-[101px] max-sm:ml-0 h-[25em] w-3/5 max-md:w-4/5 max-sm:w-full object-cover rounded-xl" src={post.videoPath} controls></video>
                }
                {
                    post.images.length > 0 &&
                    <div className="ml-[101px] max-sm:ml-0 flex items-center gap-3 flex-wrap">
                        {
                            post.images.length > 3 ?
                                <>
                                    <button onClick={() => setFullScreenPhoto(0)} title="Tryb pełnoekranowy zdjęcia">
                                        <img className="w-[100px] max-sm:w-[85px] h-[100px] max-sm:h-[85px] object-cover rounded-xl" src={post.images[0].path} alt="zdjęcie do posta" />
                                    </button>
                                    <button onClick={() => setFullScreenPhoto(1)} title="Tryb pełnoekranowy zdjęcia">
                                        <img className="w-[100px] max-sm:w-[85px] h-[100px] max-sm:h-[85px] object-cover rounded-xl" src={post.images[1].path} alt="zdjęcie do posta" />
                                    </button>
                                    <button onClick={() => setFullScreenPhoto(2)} title="Tryb pełnoekranowy zdjęcia">
                                        <img className="w-[100px] max-sm:w-[85px] h-[100px] max-sm:h-[85px] object-cover rounded-xl" src={post.images[2].path} alt="zdjęcie do posta" />
                                    </button>
                                    <button onClick={() => setFullScreenPhoto(3)} className="text-6xl w-[100px] max-sm:w-[85px] h-[100px] max-sm:h-[85px] flex items-center justify-center bg-black65 text-white rounded-xl" title="Tryb pełnoekranowy zdjęcia">+{post.images.length - 3}</button>
                                </>
                                :
                                post.images.map((image, index) => (
                                    <button key={image.id} onClick={() => setFullScreenPhoto((index))} title="Tryb pełnoekranowy zdjęcia">
                                        <img className="w-[100px] max-sm:w-[85px] h-[100px] max-sm:h-[85px] object-cover rounded-xl" src={image.path} alt="zdjęcie do posta" />
                                    </button>
                                ))
                        }
                    </div>
                }
                {
                    post.poll &&
                    <PostPoll poll={post.poll} />
                }
                {
                    <PostStats postId={post.id} setAreCommentsVisible={setAreCommentsVisible} />
                }
                {
                    fullScreenPhoto !== null &&
                    <FullScreenPhoto images={post.images} currentImage={fullScreenPhoto} setFullScreenPhoto={setFullScreenPhoto} />
                }
            </div>
            {
                areCommentsVisible &&
                <PostComments postId={post.id} />
            }
        </>
    )
}

export default Post
