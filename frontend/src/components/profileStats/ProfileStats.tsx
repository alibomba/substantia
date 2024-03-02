import axios from 'axios';
import { useState, useEffect } from 'react';
import Error from '../error/Error';
import axiosClient from '../../axiosClient';

interface Props {
    id: string
}

type Stats = {
    posts: string,
    likes: string,
    subscriptions: string
}

const ProfileStats = ({ id }: Props) => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function fetchData() {
            try {
                const { data } = await axiosClient({
                    method: 'get',
                    url: `/profile-stats/${id}`,
                    cancelToken: source.token
                });
                setStats(data);
            } catch (err) {
                setError(true);
            }
        }

        fetchData();
        return () => {
            source.cancel();
        }
    }, []);

    if (error) {
        return <Error />
    }

    return (
        <>
            {
                stats &&
                <div data-testid='statsContainer' className="flex items-center gap-8 max-sm:gap-4 flex-wrap">
                    <p className="text-4xl max-sm:text-2xl"><b>{stats.posts}</b> postów</p>
                    <p className="text-4xl max-sm:text-2xl"><b>{stats.likes}</b> polubień</p>
                    <p className="text-4xl max-sm:text-2xl"><b>{stats.subscriptions}</b> subskrybentów</p>
                </div>
            }
        </>
    )
}

export default ProfileStats
