import { Link } from "react-router-dom"



const Hero = () => {

    function scrollToQualities() {
        const section = document.querySelector('#qualities');
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    return (
        <section style={{ backgroundImage: `url('${import.meta.env.VITE_BACKEND_URL}/storage/hero-img.jpg')` }} className="relative flex flex-col items-center gap-5 px-10 max-sm:px-6 max-[470px]:px-2 py-14 max-sm:py-7 max-[470px]:py-3 bg-no-repeat bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-overlayBlack">
            <p className="z-[1] text-5xl max-md:text-4xl max-[470px]:text-3xl max-[470px]:leading-relaxed max-md:leading-relaxed text-center leading-relaxed max-w-[40ch] max-sm:max-w-[70ch] text-white font-medium">Odkryj ekskluzywne treści z Substantii! Dołącz teraz, aby zyskać dostęp do inspirujących materiałów tworzonych przez najwybitniejszych twórców.</p>
            <div className="z-[1] flex items-center justify-center gap-4 flex-wrap">
                <Link className="text-5xl max-md:text-4xl max-[470px]:text-3xl transition-primary text-primary hover:text-white font-medium bg-white hover:bg-primary px-8 py-4 rounded-full" to='/rejestracja'>Dołącz teraz</Link>
                <button onClick={scrollToQualities} className="text-5xl max-md:text-4xl max-[470px]:text-3xl transition-primary text-primary hover:text-white font-medium bg-white hover:bg-primary px-8 py-4 rounded-full">Dlaczego my?</button>
            </div>
        </section>
    )
}

export default Hero
