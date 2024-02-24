import { render, screen } from '@testing-library/react';
import { NotFound } from '..';
import { MemoryRouter } from 'react-router-dom';

describe('NotFound', () => {
    it('renders the elements correctly', () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );
        const heading = screen.getByRole('heading');
        const icon = screen.getByTestId('icon');
        const button = screen.getByText('Strona główna');
        expect(heading).toBeInTheDocument();
        expect(icon).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });
});