import { render, screen } from '@testing-library/react';
import { Footer } from '..';
import { MemoryRouter } from 'react-router-dom';

function renderComponent() {
    render(
        <MemoryRouter>
            <Footer />
        </MemoryRouter>
    )
}

describe('Footer', () => {
    it('renders logo', () => {
        renderComponent();
        const logo = screen.getByRole('img');
        expect(logo).toBeInTheDocument();
    });

    it('renders social media links', () => {
        renderComponent();
        const facebook = screen.getByTitle('Facebook');
        const instagram = screen.getByTitle('Instagram');
        const twitter = screen.getByTitle('Twitter');
        expect(facebook).toBeInTheDocument();
        expect(instagram).toBeInTheDocument();
        expect(twitter).toBeInTheDocument();
    });

    it('renders nav links', () => {
        renderComponent();
        const navLinks = screen.getAllByTestId('footerNavLink');
        expect(navLinks.length).toBe(3);
    });

    it('renders copyright text', () => {
        renderComponent();
        const text = screen.getByText(/Wszystkie prawa zastrzeżone/);
        expect(text).toBeInTheDocument();
    });
});
