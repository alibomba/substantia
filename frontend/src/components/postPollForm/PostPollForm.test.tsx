import { getByTestId, render, screen } from '@testing-library/react';
import PostPollForm from './PostPollForm';

const emptyPoll = [];
const pollWithOneOption = ['one option'];
const pollWithMultipleOptions = ['first option', 'second option', 'third option'];

function renderComponent(poll: string[]) {
    const postForm: PostForm = {
        content: '',
        images: [],
        video: null,
        poll
    }

    render(
        <PostPollForm
            postForm={postForm}
            setPostForm={vi.fn()}
            setIsPollFormActive={vi.fn()}
        />
    )
}

describe('PostPollForm', () => {
    describe('common render', () => {
        it('renders the buttons', () => {
            renderComponent([]);
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBe(3);
            expect(buttons[0]).toHaveTextContent('Dodaj opcję');
            expect(buttons[1]).toHaveTextContent('Anuluj');
            expect(buttons[2]).toHaveTextContent('Zapisz');
        });
    });

    describe('no options', () => {
        it('renders no inputs', () => {
            renderComponent([]);
            const inputs = screen.queryAllByTestId('pollOptionInput');
            expect(inputs.length).toBe(0);
        });
    });

    describe('one option', () => {
        it('renders one input', () => {
            renderComponent(pollWithOneOption);
            const input = screen.getByTestId('pollOptionInput');
            expect(input).toBeInTheDocument();
            expect(input).toHaveValue('one option');
        });

        it('renders one delete button', () => {
            renderComponent(pollWithOneOption);
            const deleteButton = screen.getByTitle('Usuń opcję');
            expect(deleteButton).toBeInTheDocument();
        });
    });

    describe('multiple options', () => {
        it('renders multiple inputs', () => {
            renderComponent(pollWithMultipleOptions);
            const inputs = screen.getAllByTestId('pollOptionInput');
            expect(inputs.length).toBe(3);
            expect(inputs[0]).toHaveValue('first option');
            expect(inputs[1]).toHaveValue('second option');
            expect(inputs[2]).toHaveValue('third option');
        });

        it('renders multiple delete buttons', () => {
            renderComponent(pollWithMultipleOptions);
            const deleteButtons = screen.getAllByTitle('Usuń opcję');
            expect(deleteButtons.length).toBe(3);
        });
    });
});