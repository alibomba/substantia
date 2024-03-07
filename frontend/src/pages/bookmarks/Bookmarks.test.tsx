import { render, screen } from '@testing-library/react';
import { Bookmarks } from '..';
import MockAdapter from 'axios-mock-adapter';
import axiosClient from '../../axiosClient';

const mockAxios = new MockAdapter(axiosClient);

vi.mock('../../components/post/Post');

const post: Post = {
    id: '123',
    content: 'test content',
    images: [],
    poll: null,
    user: { id: '123', avatar: null, slug: 'testuser', username: 'TestUser' },
    userId: '123',
    videoPath: null,
    createdAt: ''
}

describe('Bookmarks', () => {
    describe('no bookmarks', () => {
        it('renders no bookmarks paragraph', async () => {
            mockAxios.onGet('/my-bookmarks').reply(200, []);
            render(<Bookmarks />);
            const paragraph = await screen.findByText('Brak zapisanych postów');
            expect(paragraph).toBeInTheDocument();
        });
    });

    describe('there are bookmarks', () => {
        it('renders the bookmarks', async () => {
            mockAxios.onGet('/my-bookmarks').reply(200, [post, post]);
            render(<Bookmarks />);
            const posts = await screen.findAllByRole('article');
            expect(posts).toHaveLength(2);
        });
    });
});