import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PasswordReset } from '..';
import MockAdapter from 'axios-mock-adapter';
import axiosClient from '../../axiosClient';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockAxios = new MockAdapter(axiosClient);

beforeEach(() => {
    vi.resetAllMocks();
});

function renderComponent() {
    render(
        <MemoryRouter initialEntries={['/password-reset?token=testToken']}>
            <Routes>
                <Route path='/password-reset' element={<PasswordReset />} />
                <Route path='/logowanie' element={<div data-testid='loginPage'></div>} />
            </Routes>
        </MemoryRouter>
    )
}

describe('PasswordReset', () => {
    describe('initial render', () => {
        it('renders 2 inputs and a button', () => {
            renderComponent();
            const inputs = screen.getAllByTestId('input');
            const button = screen.getByText('Zapisz');
            expect(inputs.length).toBe(2);
            expect(button).toBeInTheDocument();
        });
    });

    describe('passwords do not match', () => {
        it('renders an error popup', () => {
            renderComponent();
            const inputContainers = screen.getAllByTestId('input');
            const inputs = inputContainers.map(container => container.querySelector('input')) as HTMLInputElement[];
            fireEvent.change(inputs[0], { target: { value: 'qwerty123' } });
            fireEvent.change(inputs[1], { target: { value: 'qwerty1234' } });
            const button = screen.getByText('Zapisz');
            fireEvent.click(button);
            const popup = screen.getByTestId('popup');
            expect(popup.ariaLive).toBe('assertive');
            expect(popup).toHaveTextContent('Hasła nie są identyczne');
        });
    });

    describe('failed password reset', () => {
        it('renders an error popup', async () => {
            mockAxios.onPost('/password-reset/testToken').reply(401, { message: 'password reset error' });
            renderComponent();
            const inputContainers = screen.getAllByTestId('input');
            const inputs = inputContainers.map(container => container.querySelector('input')) as HTMLInputElement[];
            fireEvent.change(inputs[0], { target: { value: 'qwerty123' } });
            fireEvent.change(inputs[1], { target: { value: 'qwerty123' } });
            const button = screen.getByText('Zapisz');
            await waitFor(() => {
                fireEvent.click(button);
            });
            const popup = screen.getByTestId('popup');
            expect(popup.ariaLive).toBe('assertive');
            expect(popup).toHaveTextContent('password reset error');
        });
    });

    describe('successfull password reset', () => {
        it('redirects to the login page', async () => {
            mockAxios.onPost('/password-reset/testToken').reply(204);
            renderComponent();
            const inputContainers = screen.getAllByTestId('input');
            const inputs = inputContainers.map(container => container.querySelector('input')) as HTMLInputElement[];
            fireEvent.change(inputs[0], { target: { value: 'qwerty123' } });
            fireEvent.change(inputs[1], { target: { value: 'qwerty123' } });
            const button = screen.getByText('Zapisz');
            await waitFor(() => {
                fireEvent.click(button);
            });
            const loginPage = screen.getByTestId('loginPage');
            expect(loginPage).toBeInTheDocument();
        });
    });
});