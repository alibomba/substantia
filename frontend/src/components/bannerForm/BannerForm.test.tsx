import { render, screen } from '@testing-library/react';
import BannerForm from './BannerForm';

function renderComponent() {
    render(
        <BannerForm
            banner='https://azure.com/banner.jpg'
            setSettings={vi.fn()}
            setError={vi.fn()}
            setPopup={vi.fn()}
        />
    )
}

describe('BannerForm', () => {
    it('renders the banner image', () => {
        renderComponent();
        const banner = screen.getByRole('img');
        expect(banner.getAttribute('src')).toBe('https://azure.com/banner.jpg');
    });

    it('renders the text', () => {
        renderComponent();
        const text = screen.getByText('Zmień banner');
        expect(text).toBeInTheDocument();
    });
});