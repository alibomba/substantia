import { render, screen } from '@testing-library/react';
import ProfileResult from './ProfileResult';
import { MemoryRouter } from 'react-router-dom';

function renderWithAvatar() {
    render(
        <MemoryRouter>
            <ProfileResult
                id='123'
                username='TestUser'
                slug='testuser'
                description='test description for a user profile'
                avatar='testSource'
            />
        </MemoryRouter>
    );
}

function renderWithNoAvatar() {
    render(
        <MemoryRouter>
            <ProfileResult
                id='123'
                username='TestUser'
                slug='testuser'
                description='test description for a user profile'
                avatar={null}
            />
        </MemoryRouter>
    );
}

describe('ProfileResult', () => {
    it('renders avatar if it is present', () => {
        renderWithAvatar();
        const avatar = screen.getByRole('img');
        expect(avatar.getAttribute('src')).toBe('testSource');
    });

    it('renders default avatar if it is not present', () => {
        renderWithNoAvatar();
        const avatar = screen.getByRole('img');
        expect(avatar.getAttribute('src')).toBe('/default.png');
    });

    it('renders username and slug', () => {
        renderWithAvatar();
        const username = screen.getByText('TestUser');
        const slug = screen.getByText('@testuser');
        expect(username).toBeInTheDocument();
        expect(slug).toBeInTheDocument();
    });

    it('renders a description', () => {
        renderWithAvatar();
        const description = screen.getByText('test description for a user profile');
        expect(description).toBeInTheDocument();
    });
});