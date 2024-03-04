import { render, screen } from '@testing-library/react';
import DescriptionForm from './DescriptionForm';

function renderComponent() {
    render(
        <DescriptionForm
            description='test description'
            setSettings={vi.fn()}
            setError={vi.fn()}
            setPopup={vi.fn()}
        />
    )
}

describe('DescriptionForm', () => {
    it('renders the textarea', () => {
        renderComponent();
        const textarea = screen.getByDisplayValue('test description');
        expect(textarea).toBeInTheDocument();
    });

    it('renders the button', () => {
        renderComponent();
        const button = screen.getByText('Zapisz');
        expect(button).toBeInTheDocument();
    });
});