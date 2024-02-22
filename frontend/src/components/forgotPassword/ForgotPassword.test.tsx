import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ForgotPassword from './ForgotPassword';
import MockAdapter from 'axios-mock-adapter';
import axiosClient from '../../axiosClient';

const mockAxios = new MockAdapter(axiosClient);

beforeEach(() => {
    vi.resetAllMocks();
});

describe('ForgotPassword', () => {
    describe('initial render', () => {
        it('renders a button', () => {
            render(<ForgotPassword />);
            const button = screen.getByText('Nie pamiętam hasła');
            expect(button).toBeInTheDocument();
        });
    });

    describe('modal', () => {
        it('toggles modal', () => {
            render(<ForgotPassword />);
            const button = screen.getByText('Nie pamiętam hasła');
            fireEvent.click(button);
            const modal = screen.getByTestId('forgotPasswordModal');
            expect(modal).toBeInTheDocument();
            const closeButton = screen.getByTitle('Zamknij okienko');
            fireEvent.click(closeButton);
            expect(modal).not.toBeInTheDocument();
        });
    });

    describe('failed password reset request', () => {
        it('renders an error popup', async () => {
            mockAxios.onPost('/password-reset').reply(422, { message: 'validation error' });
            render(<ForgotPassword />);
            const button = screen.getByText('Nie pamiętam hasła');
            fireEvent.click(button);
            const input = screen.getByTestId('input').querySelector('input') as HTMLInputElement;
            fireEvent.change(input, { target: { value: 'test@gmail.com' } });
            const submit = screen.getByText('Prześlij');
            await waitFor(() => {
                fireEvent.click(submit);
            });
            const popup = screen.getByTestId('popup');
            expect(popup.ariaLive).toBe('assertive');
            expect(popup).toHaveTextContent('validation error');
        });
    });

    describe('successful password reset request', () => {
        it('hides modal and renders a message popup', async () => {
            mockAxios.onPost('/password-reset').reply(204);
            render(<ForgotPassword />);
            const button = screen.getByText('Nie pamiętam hasła');
            fireEvent.click(button);
            const modal = screen.getByTestId('forgotPasswordModal');
            const input = screen.getByTestId('input').querySelector('input') as HTMLInputElement;
            fireEvent.change(input, { target: { value: 'test@gmail.com' } });
            const submit = screen.getByText('Prześlij');
            await waitFor(() => {
                fireEvent.click(submit);
            });
            expect(modal).not.toBeInTheDocument();
            const popup = screen.getByTestId('popup');
            expect(popup.ariaLive).toBe('assertive');
            expect(popup).toHaveTextContent('Sprawdź swoją skrzynkę e-mail');
        });
    });
});