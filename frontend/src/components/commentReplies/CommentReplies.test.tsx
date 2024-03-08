import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CommentReplies from './CommentReplies';
import MockAdapter from 'axios-mock-adapter';
import axiosClient from '../../axiosClient';
import { MemoryRouter } from 'react-router-dom';

const mockAxios = new MockAdapter(axiosClient);

function renderComponent() {
    render(
        <MemoryRouter>
            <CommentReplies commentId='123' />
        </MemoryRouter>
    )
}

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

beforeEach(() => {
    vi.resetAllMocks();
});

describe('CommentReplies', () => {
    it('renders reply form', () => {
        renderComponent();
        const form = screen.getByTestId('replyForm');
        expect(form).toBeInTheDocument();
    });

    it('renders no replies if there are not any', async () => {
        mockAxios.onGet('/comment-replies/123').reply(200, []);
        renderComponent();
        await screen.findByTestId('replyForm');
        const comment = screen.queryByRole('article');
        expect(comment).not.toBeInTheDocument();
    });

    it('renders replies if there are some', async () => {
        mockAxios.onGet('/comment-replies/123').reply(200, [mockReply, mockReply, mockReply]);
        renderComponent();
        const comments = await screen.findAllByRole('article');
        expect(comments).toHaveLength(3);
    });

    it('adds a reply', async () => {
        mockAxios.onGet('/comment-replies/123').reply(200, [mockReply, mockReply, mockReply]);
        mockAxios.onPost('/comment-replies/123').reply(201, mockReply);
        renderComponent();
        const form = screen.getByTestId('replyForm');
        const input = form.querySelector('input') as HTMLInputElement;
        const button = form.querySelector('button') as HTMLButtonElement;
        fireEvent.change(input, { target: { value: 'test content' } });
        await waitFor(() => {
            fireEvent.click(button);
        });
        const popup = screen.getByTestId('popup');
        expect(popup).toHaveTextContent('Opublikowano odpowiedź');
    });
});