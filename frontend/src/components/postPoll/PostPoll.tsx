import { useEffect, useState } from "react"
import Error from "../error/Error";
import axiosClient from "../../axiosClient";
import axios from "axios";


interface Props {
    poll: PostPoll
}

interface VotePercentage {
    id: string,
    percentage: number
}

const PostPoll = ({ poll }: Props) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [percentages, setPercentages] = useState<VotePercentage[]>([]);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function fetchData() {
            try {
                const { data } = await axiosClient({
                    method: 'get',
                    url: `/poll-votes/${poll.id}`,
                    cancelToken: source.token
                });
                setSelectedOption(data.selectedOption);
                setPercentages(data.percentages);
            } catch (err) {
                setError(true);
            }
        }

        fetchData();
        return () => {
            source.cancel();
        }
    }, []);

    async function vote(id: string) {
        try {
            const { data } = await axiosClient({
                method: 'post',
                url: `/vote/${id}`
            });
            setPercentages(data);
            setSelectedOption(id);
        } catch (err) {
            setError(true);
        }
    }

    if (error) {
        return <Error />
    }

    return (
        <div className="mt-7 ml-[101px] max-sm:ml-0 flex flex-col items-start gap-5 w-4/5 max-sm:w-full">
            {
                poll.options.map((option) => {
                    const percentageArr = percentages.filter(item => item.id === option.id);
                    const percentage = percentageArr.length ? percentageArr[0].percentage : '';

                    return (
                        <button onClick={() => vote(option.id)} className={`text-2xl max-sm:text-xl font-medium p-2 border-2 border-primary rounded-md w-full text-left relative after:content-[''] after:absolute after:origin-left after:transform ${percentage ? `after:scale-x-[${(percentage / 100).toString()}]` : 'after:scale-x-0'} after:inset-0 after:transition-primary ${selectedOption === option.id && 'after:bg-primaryTransparent'} ${(selectedOption !== null && selectedOption !== option.id) && 'after:bg-overlayBlack'}`} key={option.id}>
                            <span>{option.label}</span>
                            <span className="sr-only">This poll option has {percentage || '0'}% votes</span>
                        </button>
                    )
                })
            }
        </div>
    )
}

export default PostPoll
