import QualityArticle from "../../components/qualityArticle/QualityArticle"
import { RiShieldKeyholeFill } from 'react-icons/ri';
import { MdDiversity2 } from 'react-icons/md';
import { IoIosPeople } from 'react-icons/io';

const Qualities = () => {
    return (
        <section id="qualities" className="mt-40 px-4 flex items-center justify-center gap-12 max-sm:gap-8 flex-wrap">
            <QualityArticle
                icon={RiShieldKeyholeFill}
                heading="Wyłączność"
                text="Na naszej platformie Substantia odkryjesz ekskluzywne treści, dostępne tylko dla subskrybentów. Dołącz teraz i ciesz się unikalnymi doświadczeniami."
            />
            <QualityArticle
                icon={MdDiversity2}
                heading="Różnorodność"
                text="Na platformie Substantia znajdziesz różnorodne treści, spełniające różne zainteresowania. Dołącz już teraz i ciesz się bogactwem doświadczeń!"
            />
            <QualityArticle
                icon={IoIosPeople}
                heading="Społeczność"
                text="Zaangażuj się w społeczność Substantii - miejsce, gdzie ludzie dzielą się swoimi pasjami i inspiracjami. Dołącz już teraz i bądź częścią tej dynamicznej społeczności!"
            />
        </section>
    )
}

export default Qualities
