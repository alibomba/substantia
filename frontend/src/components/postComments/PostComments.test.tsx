import { render, screen } from '@testing-library/react';
import PostComments from './PostComments';
import MockAdapter from 'axios-mock-adapter';
import axiosClient from '../../axiosClient';

const mockAxios = new MockAdapter(axiosClient);

vi.mock('../postComment/PostComment');

beforeEach(() => {
    vi.resetAllMocks();
});

function renderComponent() {
    render(
        <PostComments
            postId='123'
        />
    )
}

describe('PostComments', () => {
    it('renders comment form', () => {
        renderComponent();
        const form = screen.getByTestId('commentForm');
        expect(form).toBeInTheDocument();
    });

    it('renders no comments paragraph', async () => {
        mockAxios.onGet('/post-comments/123?page=1').reply(200, { currentPage: 0, lastPage: 0, data: [] });
        renderComponent();
        const loading = screen.getByTestId('loading');
        expect(loading).toBeInTheDocument();
        const paragraph = await screen.findByText('Brak komentarzy');
        expect(paragraph).toBeInTheDocument();
    });
});