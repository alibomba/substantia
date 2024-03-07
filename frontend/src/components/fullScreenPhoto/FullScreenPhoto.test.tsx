import { render, screen } from '@testing-library/react';
import FullScreenPhoto from './FullScreenPhoto';

function renderComponent() {
    render(
        <FullScreenPhoto
            images={[
                {
                    id: '123',
                    path: 'image1.jpg',
                    postId: '123',
                    createdAt: ''
                },
                {
                    id: '1234',
                    path: 'image2.jpg',
                    postId: '123',
                    createdAt: ''
                },
                {
                    id: '1235',
                    path: 'image2.jpg',
                    postId: '123',
                    createdAt: ''
                },
                {
                    id: '1236',
                    path: 'image3.jpg',
                    postId: '123',
                    createdAt: ''
                }
            ]}
            currentImage={0}
            setFullScreenPhoto={vi.fn()}
        />
    )
}

describe('FullScreenPhoto', () => {
    it('renders the image', () => {
        renderComponent();
        const image = screen.getByRole('img');
        expect(image).toBeInTheDocument();
        expect(image.getAttribute('src')).toBe('image1.jpg');
    });

    it('renders buttons', () => {
        renderComponent();
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(3);
    });
});