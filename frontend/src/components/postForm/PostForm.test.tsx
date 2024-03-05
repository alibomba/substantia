import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PostForm from './PostForm';
import MockAdapter from 'axios-mock-adapter';
import axiosClient from '../../axiosClient';

const mockAxios = new MockAdapter(axiosClient);

beforeEach(() => {
    vi.resetAllMocks();
});

function renderComponent() {
    render(
        <PostForm
            setPosts={vi.fn()}
        />
    )
}

describe('PostForm', () => {
    describe('initial render', () => {
        it('renders avatar', () => {
            renderComponent();
            const avatar = screen.getByRole('img');
            expect(avatar).toBeInTheDocument();
        });

        it('renders content input', () => {
            renderComponent();
            const input = screen.getByTestId('postContentInput');
            expect(input).toBeInTheDocument();
        });

        it('renders the buttons', () => {
            renderComponent();
            const buttons = screen.getAllByTestId('postButton');
            expect(buttons.length).toBe(3);
        });

        it('renders the submit button', () => {
            renderComponent();
            const button = screen.getByText('Opublikuj');
            expect(button).toBeInTheDocument();
        });

        it('shows the post poll form on button click', () => {
            renderComponent();
            const buttons = screen.getAllByTestId('postButton');
            fireEvent.click(buttons[2]);
            const pollForm = screen.getByTestId('postPollForm');
            expect(pollForm).toBeInTheDocument();
        });
    });

    describe('validation error', () => {
        it('renders the error popup', async () => {
            mockAxios.onPost('/posts').reply(422, { message: 'validation error' });
            renderComponent();
            const input = screen.getByTestId('postContentInput');
            fireEvent.change(input, { target: { value: 'test content' } });
            const button = screen.getByText('Opublikuj');
            await waitFor(() => {
                fireEvent.click(button);
            });
            const popup = screen.getByTestId('popup');
            expect(popup).toHaveTextContent('validation error');
            expect(popup).toHaveClass('bg-[rgba(255,0,0,.85)]');
        });
    });

    describe('successful post upload', () => {
        it('renders the alert popup', async () => {
            mockAxios.onPost('/posts').reply(201, expect.any(Object));
            renderComponent();
            const input = screen.getByTestId('postContentInput');
            fireEvent.change(input, { target: { value: 'test content' } });
            const button = screen.getByText('Opublikuj');
            await waitFor(() => {
                fireEvent.click(button);
            });
            const popup = screen.getByTestId('popup');
            expect(popup).toHaveTextContent('Opublikowano post');
            expect(popup).toHaveClass('bg-[rgba(0,255,0,.85)]');
        });
    });
});