import { render, screen } from '@testing-library/react';
import EmailForm from './EmailForm';

function renderComponent() {
    render(
        <EmailForm
            email='test@gmail.com'
            setSettings={vi.fn()}
            setError={vi.fn()}
            setPopup={vi.fn()}
        />
    )
}

describe('EmailForm', () => {
    it('renders the input', () => {
        renderComponent();
        const input = screen.getByDisplayValue('test@gmail.com');
        expect(input).toBeInTheDocument();
    });

    it('renders the button', () => {
        renderComponent();
        const button = screen.getByText('Zapisz');
        expect(button).toBeInTheDocument();
    });
});