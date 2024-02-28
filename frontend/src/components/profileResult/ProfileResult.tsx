import { Link } from "react-router-dom"


interface Props {
    id: string,
    avatar: string | null,
    username: string,
    slug: string,
    description: string
}

const ProfileResult = ({ id, avatar, username, slug, description }: Props) => {
    return (
        <article data-testid='profileResult' className="flex flex-col items-start max-sm:gap-4">
            <div className="flex items-center gap-4 flex-wrap">
                <Link to={`/profil/${id}`}>
                    <img className="w-[10em] max-sm:w-[7em] h-[10em] max-sm:h-[7em] object-cover rounded-full border-2 border-primary" src={avatar ? avatar : '/default.png'} alt="zdjęcie profilowe" />
                </Link>
                <div className="flex flex-col items-start gap-3 max-sm:gap-2">
                    <h3 className="text-5xl max-sm:text-4xl font-bold"><Link to={`/profil/${id}`}>{username}</Link></h3>
                    <p className="text-4xl max-sm:text-3xl font-medium text-black65">@{slug}</p>
                </div>
            </div>
            <p className="text-3xl max-sm:text-2xl text-black65 leading-relaxed max-w-[60ch] ml-[5.75em] max-md:ml-[.25em]">{description}</p>
        </article>
    )
}

export default ProfileResult
