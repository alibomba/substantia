import { render, screen } from '@testing-library/react';
import AvatarForm from './AvatarForm';

function renderWithAvatar() {
    render(
        <AvatarForm
            avatar='https://azure.com/pfp.jpg'
            setError={vi.fn()}
            setSettings={vi.fn()}
            setPopup={vi.fn()}
        />
    )
}

function renderWithNoAvatar() {
    render(
        <AvatarForm
            avatar={null}
            setError={vi.fn()}
            setSettings={vi.fn()}
            setPopup={vi.fn()}
        />
    )
}

describe('AvatarForm', () => {
    it('renders text', () => {
        renderWithAvatar();
        const text = screen.getByText('Zmień avatar');
        expect(text).toBeInTheDocument();
    });

    it('renders avatar if there is one', () => {
        renderWithAvatar();
        const image = screen.getByRole('img');
        expect(image.getAttribute('src')).toBe('https://azure.com/pfp.jpg');
    });

    it('renders default avatar if there is none', () => {
        renderWithNoAvatar();
        const image = screen.getByRole('img');
        expect(image.getAttribute('src')).toBe('/default.png');
    });
});