import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RegisterForm } from '..';
import MockAdapter from 'axios-mock-adapter';
import axiosClient from '../../axiosClient';
import { MemoryRouter } from 'react-router-dom';

const mockAxios = new MockAdapter(axiosClient);

function renderComponent() {
    render(
        <MemoryRouter>
            <RegisterForm />
        </MemoryRouter>
    );
}

beforeEach(() => {
    vi.resetAllMocks();
});

describe('RegisterForm', () => {
    describe('initial render', () => {
        it('renders all inputs', () => {
            renderComponent();
            const inputs = screen.getAllByTestId('input');
            expect(inputs.length).toBe(5);
        });

        it('renders button', () => {
            renderComponent();
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
            expect(button).toHaveTextContent('Zarejestruj się');
        });

        it('renders links below form', () => {
            renderComponent();
            const span = screen.getByText('Masz już konto?');
            const loginLink = screen.getByText('Zaloguj się');
            const homepageLink = screen.getByText('Strona główna');
            expect(span).toBeInTheDocument();
            expect(loginLink).toBeInTheDocument();
            expect(homepageLink).toBeInTheDocument();
        });
    });

    describe('passwords do not match', () => {
        it('shows an error popup', () => {
            renderComponent();
            const inputContainers = screen.getAllByTestId('input');
            const inputs = inputContainers.map(container => container.querySelector('input')) as HTMLInputElement[];
            const button = screen.getByRole('button');
            fireEvent.change(inputs[0], { target: { value: 'test@gmail.com' } });
            fireEvent.change(inputs[1], { target: { value: 'Test User' } });
            fireEvent.change(inputs[2], { target: { value: 'testuser' } });
            fireEvent.change(inputs[3], { target: { value: 'qwerty123' } });
            fireEvent.change(inputs[4], { target: { value: 'qwerty12345' } });
            fireEvent.click(button);
            const popup = screen.getByRole('alert');
            expect(popup.ariaLive).toBe('assertive');
            expect(popup).toHaveTextContent('Hasła nie są identyczne');
        });
    });

    describe('validation error from the server', () => {
        it('shows an error popup', async () => {
            mockAxios.onPost('/register').reply(422, { message: 'Validation error' });
            renderComponent();
            const inputContainers = screen.getAllByTestId('input');
            const inputs = inputContainers.map(container => container.querySelector('input')) as HTMLInputElement[];
            const button = screen.getByRole('button');
            fireEvent.change(inputs[0], { target: { value: 'test@gmail.com' } });
            fireEvent.change(inputs[1], { target: { value: 'Test User' } });
            fireEvent.change(inputs[2], { target: { value: 'testuser' } });
            fireEvent.change(inputs[3], { target: { value: 'qwerty123' } });
            fireEvent.change(inputs[4], { target: { value: 'qwerty123' } });
            await waitFor(() => {
                fireEvent.click(button);
            });
            const popup = screen.getByRole('alert');
            expect(popup.ariaLive).toBe('assertive');
            expect(popup).toHaveTextContent('Validation error');
        });
    });
});