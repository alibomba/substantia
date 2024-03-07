import { render, screen } from '@testing-library/react';
import PostPoll from './PostPoll';

function renderComponent() {
    render(
        <PostPoll
            poll={{
                id: '123',
                postId: '12345',
                createdAt: '',
                options: [
                    {
                        id: '1234',
                        label: 'option 1',
                        pollId: '123',
                        votes: []
                    },
                    {
                        id: '1235',
                        label: 'option 2',
                        pollId: '123',
                        votes: []
                    },
                    {
                        id: '1236',
                        label: 'option 3',
                        pollId: '123',
                        votes: []
                    }
                ]
            }}
        />
    )
}

describe('PostPoll', () => {
    it('renders all the options', () => {
        renderComponent();
        const options = screen.getAllByRole('button');
        const spans = options.map(option => option.querySelectorAll('span')[0]);
        expect(options).toHaveLength(3);
        expect(spans[0]).toHaveTextContent('option 1');
        expect(spans[1]).toHaveTextContent('option 2');
        expect(spans[2]).toHaveTextContent('option 3');
    });
});