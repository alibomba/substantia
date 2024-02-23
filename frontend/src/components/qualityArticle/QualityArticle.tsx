import { IconType } from "react-icons"


interface Props {
    icon: IconType
    heading: string,
    text: string
}

const QualityArticle = ({ icon: Icon, heading, text }: Props) => {
    return (
        <article className="flex flex-col items-center justify-center text-center gap-4 max-sm:gap-2">
            {<Icon data-testid='articleIcon' className="text-[10rem] max-sm:text-[7rem] text-primary" />}
            <h3 className="text-5xl max-sm:text-4xl font-bold">{heading}</h3>
            <p className="text-3xl max-sm:text-2xl text-black65 leading-relaxed max-w-[28ch] max-lg:max-w-[50ch]">{text}</p>
        </article>
    )
}

export default QualityArticle
