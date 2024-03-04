import { render, screen } from '@testing-library/react';
import UsernameSlugForm from './UsernameSlugForm';

function renderComponent() {
    render(
        <UsernameSlugForm
            username='TestUser'
            slug='testuser'
            setSettings={vi.fn()}
            setError={vi.fn()}
            setPopup={vi.fn()}
        />
    )
}

describe('UsernameSlugForm', () => {
    it('renders inputs with correct values', () => {
        renderComponent();
        const inputContainers = screen.getAllByTestId('input');
        const inputs = inputContainers.map(container => container.querySelector('input')) as HTMLInputElement[];
        expect(inputs[0]).toHaveValue('TestUser');
        expect(inputs[1]).toHaveValue('testuser');
    });

    it('renders a submit button', () => {
        renderComponent();
        const button = screen.getByText('Zapisz');
        expect(button).toBeInTheDocument();
    });
});