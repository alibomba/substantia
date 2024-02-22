import { Hero, HomeSection } from "../../sections"


const Homepage = () => {
    return (
        <>
            <Hero />
            <HomeSection
                heading="Jeden plan, cały dostęp"
                text="Odkryj pełną gamę treści z Substantii dzięki jednemu planowi subskrypcji. Z nami, jedno konto to wszystko, czego potrzebujesz, aby cieszyć się inspirującymi treściami, gdziekolwiek jesteś."
                imageSrc={`${import.meta.env.VITE_BACKEND_URL}/storage/one-plan.jpg`}
                imageAlt="młody mężczyzna w lesie patrzący w telefon"
                textFirst={false}
            />
            <HomeSection
                heading="Twórz lub konsumuj treści"
                text="Odkryj swoją kreatywność lub ciesz się bogactwem treści dostępnych w Substantii. Bez względu na to, czy chcesz tworzyć inspirujące materiały czy po prostu korzystać z nich, nasza platforma zapewni Ci wszystko, czego potrzebujesz, aby realizować swoje pasje."
                imageSrc={`${import.meta.env.VITE_BACKEND_URL}/storage/create-or-consume-content.jpg`}
                imageAlt="kobieta ustawiająca aparat w telefonie pod lampą pierścieniową"
                textFirst={true}
            />
        </>
    )
}

export default Homepage
