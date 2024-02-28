import { FaSearch } from 'react-icons/fa';
import ProfileResult from '../../components/profileResult/ProfileResult';
import { useState } from 'react';
import Error from '../../components/error/Error';
import axiosClient from '../../axiosClient';

const Search = () => {
    const [profiles, setProfiles] = useState<ProfileResult[]>([]);
    const [noResults, setNoResults] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    async function search(e: React.FormEvent) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const input = form.querySelector('input') as HTMLInputElement;
        if (!input.value) return;
        try {
            const { data } = await axiosClient({
                method: 'get',
                url: `/search?phrase=${input.value}`
            });
            if (data.length === 0) {
                setNoResults(true);
            }
            else {
                setNoResults(false);
                setProfiles(data);
            }
        } catch (err) {
            setError(true);
        }
    }

    if (error) {
        return <Error />
    }

    return (
        <main className="p-8 max-sm:px-4">
            <form data-testid='searchForm' onSubmit={search} className='flex items-center justify-center gap-4 w-[45em] max-md:w-full mx-auto'>
                <input placeholder='Wyszukaj...' aria-label='Wyszukaj' className='text-4xl max-md:text-3xl p-2 border-2 border-primary w-full rounded-lg' type="text" />
                <button className='text-5xl max-md:text-4xl text-primary hover:text-primaryHover transition-primary' title="Wyszukaj">
                    <FaSearch />
                </button>
            </form>
            <div className='mt-24 mx-auto px-8 max-md:px-4 max-sm:px-0 w-full flex flex-col items-start gap-4'>
                {
                    profiles.length > 0 &&
                    <>
                        {
                            profiles.map(profile => (
                                <ProfileResult
                                    key={profile.id}
                                    id={profile.id}
                                    avatar={profile.avatar}
                                    username={profile.username}
                                    slug={profile.slug}
                                    description={profile.description}
                                />
                            ))
                        }
                    </>
                }
                {
                    noResults && <p className='text-6xl max-[510px]:text-4xl max-[510px]:w-full text-center text-white bg-[rgba(255,0,0,.65)] px-10 py-6 font-medium rounded-[30px] mx-auto'>Brak wyników</p>
                }
            </div>
        </main>
    )
}

export default Search
