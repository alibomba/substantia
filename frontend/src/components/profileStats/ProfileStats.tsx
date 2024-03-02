

interface Props {
    id: string
}

const ProfileStats = ({ id }: Props) => {
    return (
        <div className="flex items-center gap-8 max-sm:gap-4 flex-wrap">
            <p className="text-4xl max-sm:text-2xl"><b>200</b> postów</p>
            <p className="text-4xl max-sm:text-2xl"><b>320k</b> polubień</p>
            <p className="text-4xl max-sm:text-2xl"><b>102k</b> subskrybentów</p>
        </div>
    )
}

export default ProfileStats
