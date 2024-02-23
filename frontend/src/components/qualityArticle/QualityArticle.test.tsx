import { render, screen } from '@testing-library/react';
import QualityArticle from './QualityArticle';
import { FaAd } from 'react-icons/fa';

function renderComponent() {
    render(
        <QualityArticle
            heading='Nagłówek'
            text='Tekst tagu p'
            icon={FaAd}
        />
    );
}

describe('QualityArticle', () => {
    it('renders the heading', () => {
        renderComponent();
        const heading = screen.getByRole('heading');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Nagłówek');
    });

    it('renders the paragraph', () => {
        renderComponent();
        const paragraph = screen.getByText('Tekst tagu p');
        expect(paragraph).toBeInTheDocument();
    });

    it('renders the icon', () => {
        renderComponent();
        const icon = screen.getByTestId('articleIcon');
        expect(icon).toBeInTheDocument();
    });
});