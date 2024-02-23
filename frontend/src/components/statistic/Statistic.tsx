

interface Props {
    number: string,
    title: string
}

const Statistic = ({ number, title }: Props) => {
    return (
        <div className="flex flex-col items-center gap-2 text-center max-w-[50ch]">
            <p className="text-6xl max-sm:text-5xl font-bold text-primary">{number}</p>
            <p className="text-5xl max-sm:text-4xl font-medium leading-snug">{title}</p>
        </div>
    )
}

export default Statistic
