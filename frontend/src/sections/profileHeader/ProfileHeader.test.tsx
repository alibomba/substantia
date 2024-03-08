import { render, screen } from '@testing-library/react';
import { ProfileHeader } from '..';

const noAvatar = <ProfileHeader
    profile={{ id: '123', banner: '/banner.jpg', facebook: '#', instagram: '#', twitter: null, avatar: null, username: 'TestUser', slug: 'testuser', subscriptionPrice: 1299, description: 'test user description', profileVideo: '/video.mp4' }}
    isSubscribed={false}
    setIsSubscribed={vi.fn()}
/>

const withAvatar = <ProfileHeader
    profile={{ id: '123', banner: '/banner.jpg', facebook: '#', instagram: '#', twitter: null, avatar: '/avatar.jpg', username: 'TestUser', slug: 'testuser', subscriptionPrice: 1299, description: 'test user description', profileVideo: '/video.mp4' }}
    isSubscribed={false}
    setIsSubscribed={vi.fn()}
/>

vi.mock('../../components/subscribeButton/SubscribeButton');
vi.mock('../../components/profileStats/ProfileStats');

describe('ProfileHeader', () => {
    describe('no avatar', () => {
        it('renders a default avatar', () => {
            render(noAvatar);
            const avatar = screen.getByTestId('avatar');
            expect(avatar.getAttribute('src')).toBe('/default.png');
        });
    });

    describe('with avatar', () => {
        it('renders a correct avatar', () => {
            render(withAvatar);
            const avatar = screen.getByTestId('avatar');
            expect(avatar.getAttribute('src')).toBe('/avatar.jpg');
        });

        it('renders a correct banner', () => {
            render(withAvatar);
            const banner = screen.getByTestId('banner');
            expect(banner.getAttribute('src')).toBe('/banner.jpg');
        });

        it('renders social media links', () => {
            render(withAvatar);
            const facebook = screen.getByTitle('Facebook');
            const instagram = screen.getByTitle('Instagram');
            const twitter = screen.queryByTitle('Twitter');
            expect(facebook).toBeInTheDocument();
            expect(instagram).toBeInTheDocument();
            expect(twitter).not.toBeInTheDocument();
        });

        it('renders a username', () => {
            render(withAvatar);
            const username = screen.getByText('TestUser');
            expect(username).toBeInTheDocument();
        });

        it('renders a slug', () => {
            render(withAvatar);
            const slug = screen.getByText('@testuser');
            expect(slug).toBeInTheDocument();
        });

        it('renders a description', () => {
            render(withAvatar);
            const description = screen.getByText('test user description');
            expect(description).toBeInTheDocument();
        });
    });

});