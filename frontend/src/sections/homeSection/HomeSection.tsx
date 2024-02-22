

interface Props {
    heading: string,
    text: string,
    imageSrc: string,
    imageAlt: string,
    textFirst: boolean
}

const HomeSection = ({ heading, text, imageSrc, imageAlt, textFirst }: Props) => {
    return (
        <section data-testid='homeSection' className={`flex ${textFirst && 'flex-row-reverse'} max-lg:flex-col items-start max-lg:items-center justify-center gap-7 mt-20 px-7 max-sm:px-4 py-5 max-sm:py-3`}>
            <img className="w-2/5 max-lg:w-full h-[27rem] max-sm:h-[18rem] max-[400px]:h-[14rem] object-cover" src={imageSrc} alt={imageAlt} />
            <div className="flex flex-col items-start max-lg:items-center max-lg:text-center gap-10 max-sm:gap-5">
                <h2 className="text-5xl max-sm:text-4xl max-[400px]:text-3xl font-bold">{heading}</h2>
                <p className="text-4xl max-sm:text-3xl max-[400px]:text-2xl max-sm:leading-relaxed max-[400px]:leading-relaxed text-black65 leading-relaxed max-w-[50ch]">{text}</p>
            </div>
        </section>
    )
}

export default HomeSection
