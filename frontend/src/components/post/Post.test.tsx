import { render, screen } from '@testing-library/react';
import Post from './Post';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../postPoll/PostPoll');
vi.mock('../postStats/PostStats');
vi.mock('../fullScreenPhoto/FullScreenPhoto');
vi.mock('../postComments/PostComments');

const mockPost: Post = {
    id: '123',
    content: 'test content',
    images: [
        {
            id: '123',
            postId: '123',
            path: 'imagePath.jpg',
            createdAt: ''
        }
    ],
    poll: null,
    user: {
        id: '123',
        username: 'TestUser',
        avatar: null,
        slug: 'testuser'
    },
    userId: '123',
    videoPath: null,
    createdAt: ''
}


function renderComponent() {
    render(
        <MemoryRouter>
            <Post
                post={mockPost}
            />
        </MemoryRouter>
    )
}

describe('Post', () => {
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
        const content = screen.getByText('test content');
        expect(content).toBeInTheDocument();
    });

    it('renders the image', () => {
        renderComponent();
        const button = screen.getByTitle('Tryb pełnoekranowy zdjęcia');
        const image = button.querySelector('img');
        expect(button).toBeInTheDocument();
        expect(image?.getAttribute('src')).toBe('imagePath.jpg');
    });
});