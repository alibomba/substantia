import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PostStats from './PostStats';
import MockAdapter from 'axios-mock-adapter';
import axiosClient from '../../axiosClient';

const mockAxios = new MockAdapter(axiosClient);

function renderComponent() {
    render(
        <PostStats postId='123' setAreCommentsVisible={vi.fn()} />
    )
}

describe('PostStats', () => {
    it('renders the stats correctly', async () => {
        mockAxios.onGet('/post-stats/123').reply(200, { stats: { likes: 20, comments: 5 }, isLiked: true, isBookmarked: false });
        renderComponent();
        const likeCount = await screen.findByTestId('likeCount');
        const commentCount = await screen.findByTestId('commentCount');
        expect(likeCount).toHaveTextContent('20');
        expect(commentCount).toHaveTextContent('5');
    });

    it('renders the titles correctly', async () => {
        mockAxios.onGet('/post-stats/123').reply(200, { stats: { likes: 20, comments: 5 }, isLiked: true, isBookmarked: false });
        renderComponent();
        const likeButton = await screen.findByTitle('Usuń serce z posta');
        const bookmarkButton = await screen.findByTitle('Zapisz post');
        expect(likeButton).toBeInTheDocument();
        expect(bookmarkButton).toBeInTheDocument();
    });

    it('likes the post', async () => {
        mockAxios.onGet('/post-stats/123').reply(200, { stats: { likes: 20, comments: 5 }, isLiked: false, isBookmarked: false });
        mockAxios.onPost('/like-post/123').reply(201);
        renderComponent();
        const likeButton = await screen.findByTitle('Dodaj serce do posta');
        await waitFor(() => {
            fireEvent.click(likeButton);
        });
        const popup = screen.getByTestId('popup');
        const likeCount = screen.getByTestId('likeCount');
        expect(popup).toHaveTextContent('Dodano serce');
        expect(likeCount).toHaveTextContent('21');
    });

    it('deletes the like from the post', async () => {
        mockAxios.onGet('/post-stats/123').reply(200, { stats: { likes: 20, comments: 5 }, isLiked: true, isBookmarked: false });
        mockAxios.onPost('/like-post/123').reply(204);
        renderComponent();
        const likeButton = await screen.findByTitle('Usuń serce z posta');
        await waitFor(() => {
            fireEvent.click(likeButton);
        });
        const popup = screen.getByTestId('popup');
        const likeCount = screen.getByTestId('likeCount');
        expect(popup).toHaveTextContent('Usunięto serce');
        expect(likeCount).toHaveTextContent('19');
    });

    it('bookmarks the post', async () => {
        mockAxios.onGet('/post-stats/123').reply(200, { stats: { likes: 20, comments: 5 }, isLiked: true, isBookmarked: false });
        mockAxios.onPost('/bookmark-post/123').reply(201);
        renderComponent();
        const bookmarkButton = await screen.findByTitle('Zapisz post');
        await waitFor(() => {
            fireEvent.click(bookmarkButton);
        });
        const popup = screen.getByTestId('popup');
        expect(popup).toHaveTextContent('Dodano do zapisanych');
    });

    it('unbookmarks the post', async () => {
        mockAxios.onGet('/post-stats/123').reply(200, { stats: { likes: 20, comments: 5 }, isLiked: true, isBookmarked: true });
        mockAxios.onPost('/bookmark-post/123').reply(204);
        renderComponent();
        const bookmarkButton = await screen.findByTitle('Usuń post z zapisanych');
        await waitFor(() => {
            fireEvent.click(bookmarkButton);
        });
        const popup = screen.getByTestId('popup');
        expect(popup).toHaveTextContent('Usunięto z zapisanych');
    });
});