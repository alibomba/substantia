import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PostComment from './PostComment';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import axiosClient from '../../axiosClient';

const mockAxios = new MockAdapter(axiosClient);

const mockComment: PostComment = {
    id: '123',
    content: 'test comment content',
    userId: '123',
    postId: '123',
    user: {
        id: '123',
        username: 'TestUser',
        slug: 'testuser',
        avatar: null
    },
    createdAt: ''
}

vi.mock('../commentReplies/CommentReplies');

beforeEach(() => {
    vi.resetAllMocks();
});

function renderComponent() {
    render(
        <MemoryRouter>
            <PostComment comment={mockComment} />
        </MemoryRouter>
    )
}

describe('PostComment', () => {
    it('renders avatar', () => {
        renderComponent();
        const avatar = screen.getByTestId('avatar');
        expect(avatar).toBeInTheDocument();
        expect(avatar.getAttribute('src')).toBe('/default.png');
    });

    it('renders username and slug', () => {
        renderComponent();
        const username = screen.getByText('TestUser');
        const slug = screen.getByText('@testuser');
        expect(username).toBeInTheDocument();
        expect(slug).toBeInTheDocument();
    });

    it('renders content', () => {
        renderComponent();
        const content = screen.getByText('test comment content');
        expect(content).toBeInTheDocument();
    });

    it('renders liked stats', async () => {
        mockAxios.onGet('/comment-stats/123').reply(200, { stats: { likes: 20, replies: 3 }, isLiked: true });
        renderComponent();
        const likeButton = await screen.findByTitle('Usuń serce z komentarza');
        const likeCount = screen.getByTestId('likeCount');
        const replyCount = screen.getByTestId('replyCount');
        expect(likeButton).toBeInTheDocument();
        expect(likeCount).toHaveTextContent('20');
        expect(replyCount).toHaveTextContent('3');
    });

    it('renders unliked title correctly', async () => {
        mockAxios.onGet('/comment-stats/123').reply(200, { stats: { likes: 20, replies: 3 }, isLiked: false });
        renderComponent();
        const likeButton = await screen.findByTitle('Dodaj serce do komentarza');
        expect(likeButton).toBeInTheDocument();
    });

    it('likes the comment', async () => {
        mockAxios.onGet('/comment-stats/123').reply(200, { stats: { likes: 20, replies: 3 }, isLiked: false });
        mockAxios.onPost('/like-comment/123').reply(201);
        renderComponent();
        const likeButton = await screen.findByTitle('Dodaj serce do komentarza');
        await waitFor(() => {
            fireEvent.click(likeButton);
        });
        const popup = screen.getByTestId('popup');
        expect(popup).toHaveTextContent('Dodano serce');
    });

    it('unlikes the comment', async () => {
        mockAxios.onGet('/comment-stats/123').reply(200, { stats: { likes: 20, replies: 3 }, isLiked: true });
        mockAxios.onPost('/like-comment/123').reply(204);
        renderComponent();
        const likeButton = await screen.findByTitle('Usuń serce z komentarza');
        await waitFor(() => {
            fireEvent.click(likeButton);
        });
        const popup = screen.getByTestId('popup');
        expect(popup).toHaveTextContent('Usunięto serce');
    });
});