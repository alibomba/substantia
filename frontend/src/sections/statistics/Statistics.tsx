import Statistic from "../../components/statistic/Statistic"


const Statistics = () => {
    return (
        <section className="mt-32 px-4 grid grid-cols-3 max-[1320px]:grid-cols-2 max-lg:grid-cols-1 items-center justify-items-center gap-x-6 gap-y-16">
            <Statistic
                number="100k"
                title="subskrybentów"
            />
            <Statistic
                number="1M"
                title="wyświetleń"
            />
            <Statistic
                number="500+"
                title="twórców"
            />
            <Statistic
                number="4.8/5"
                title="zadowolonych użytkowników"
            />
            <Statistic
                number="+20%/mies."
                title="wzrost społeczności"
            />
            <Statistic
                number="30+"
                title="państw"
            />
        </section>
    )
}

export default Statistics
