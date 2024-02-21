import { render, screen } from '@testing-library/react';
import HeaderDropdown from './HeaderDropdown';
import { MemoryRouter } from 'react-router-dom';

function renderComponent() {
    render(
        <MemoryRouter>
            <HeaderDropdown
                setState={vi.fn()}
            />
        </MemoryRouter>
    )
}

describe('HeaderDropdown', () => {
    it('renders elements correctly', () => {
        renderComponent();
        const links = screen.getAllByRole('link');
        expect(links.length).toBe(3);
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBe(2);
    });
});