import { render, screen } from '@testing-library/react';
import { Hero } from '..';
import { MemoryRouter } from 'react-router-dom';

function renderComponent() {
    render(
        <MemoryRouter>
            <Hero />
        </MemoryRouter>
    )
}

describe('Hero', () => {
    it('renders all elements correctly', () => {
        renderComponent();
        const text = screen.getByText(/Odkryj ekskluzywne treści*/);
        const button1 = screen.getByText('Dołącz teraz');
        const button2 = screen.getByText('Dlaczego my?');
        expect(text).toBeInTheDocument();
        expect(button1).toBeInTheDocument();
        expect(button2).toBeInTheDocument();
    });
});