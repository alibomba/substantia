import { render, screen } from '@testing-library/react';
import ProfileStats from './ProfileStats';
import MockAdapter from 'axios-mock-adapter';
import axiosClient from '../../axiosClient';

const mockAxios = new MockAdapter(axiosClient);

beforeEach(() => {
    vi.resetAllMocks();
});

describe('ProfileStats', () => {
    describe('initial render', () => {
        it('does not render anything', () => {
            render(<ProfileStats id='123' />);
            const stats = screen.queryByTestId('statsContainer');
            expect(stats).not.toBeInTheDocument();
        });
    });

    describe('after fetched data', () => {
        it('renders stats correctly', async () => {
            mockAxios.onGet('/profile-stats/123').reply(200, { posts: '100', likes: '122k', subscriptions: '887' });
            render(<ProfileStats id='123' />);
            const stats = await screen.findByTestId('statsContainer');
            const posts = screen.getByText('100');
            const likes = screen.getByText('122k');
            const subscriptions = screen.getByText('887');
            expect(stats).toBeInTheDocument();
            expect(posts).toBeInTheDocument();
            expect(likes).toBeInTheDocument();
            expect(subscriptions).toBeInTheDocument();
        });
    });
});