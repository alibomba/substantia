import { render, screen } from '@testing-library/react';
import Statistic from './Statistic';

function renderComponent() {
    render(
        <Statistic
            number='200k'
            title='przykładowy tytuł'
        />
    );
}

describe('Statistic', () => {
    it('renders the number', () => {
        renderComponent();
        const number = screen.getByText('200k');
        expect(number).toBeInTheDocument();
    });

    it('renders the title', () => {
        renderComponent();
        const title = screen.getByText('przykładowy tytuł');
        expect(title).toBeInTheDocument();
    });
});