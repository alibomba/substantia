import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CommentReply from './CommentReply';
import MockAdapter from 'axios-mock-adapter';
import axiosClient from '../../axiosClient';
import { MemoryRouter } from 'react-router-dom';

const mockAxios = new MockAdapter(axiosClient);

beforeEach(() => {
    vi.resetAllMocks();
});

const mockReply: CommentReply = {
    id: '123',
    content: 'test reply content',
    commentId: '123',
    userId: '123',
    likes: 5,
    user: {
        id: '123',
        username: 'TestUser',
        slug: 'testuser',
        avatar: null
    },
    createdAt: ''
}

function renderComponent() {
    render(
        <MemoryRouter>
            <CommentReply
                reply={mockReply}
                setReplies={vi.fn()}
            />
        </MemoryRouter>
    )
}

describe('CommentReply', () => {
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
        const content = screen.getByText('test reply content');
        expect(content).toBeInTheDocument();
    });

    it('renders correct like count', () => {
        renderComponent();
        const likeCount = screen.getByTestId('likeCount');
        expect(likeCount).toHaveTextContent('5');
    });

    it('renders correct like button title if it is not liked', async () => {
        mockAxios.onGet('/is-reply-liked/123').reply(200, { isLiked: false });
        renderComponent();
        const likeButton = await screen.findByTitle('Dodaj serce do odpowiedzi');
        expect(likeButton).toBeInTheDocument();
    });

    it('renders correct like button title if it is liked', async () => {
        mockAxios.onGet('/is-reply-liked/123').reply(200, { isLiked: true });
        renderComponent();
        const likeButton = await screen.findByTitle('Usuń serce z odpowiedzi');
        expect(likeButton).toBeInTheDocument();
    });

    it('likes the reply', async () => {
        mockAxios.onGet('/is-reply-liked/123').reply(200, { isLiked: false });
        mockAxios.onPost('/like-reply/123').reply(201);
        renderComponent();
        const likeButton = await screen.findByTitle('Dodaj serce do odpowiedzi');
        await waitFor(() => {
            fireEvent.click(likeButton);
        });
        const popup = screen.getByTestId('popup');
        expect(popup).toHaveTextContent('Dodano serce');
    });

    it('unlikes the reply', async () => {
        mockAxios.onGet('/is-reply-liked/123').reply(200, { isLiked: true });
        mockAxios.onPost('/like-reply/123').reply(204);
        renderComponent();
        const likeButton = await screen.findByTitle('Usuń serce z odpowiedzi');
        await waitFor(() => {
            fireEvent.click(likeButton);
        });
        const popup = screen.getByTestId('popup');
        expect(popup).toHaveTextContent('Usunięto serce');
    });
});