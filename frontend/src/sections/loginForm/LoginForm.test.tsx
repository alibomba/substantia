import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '..';
import MockAdapter from 'axios-mock-adapter';
import axiosClient from '../../axiosClient';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockAxios = new MockAdapter(axiosClient);

function renderComponent() {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path='/' element={<LoginForm />} />
                <Route path='/feed' element={<div data-testid='feedPage'></div>} />
            </Routes>
        </MemoryRouter>
    );
}

beforeEach(() => {
    vi.resetAllMocks();
});

describe('LoginForm', () => {
    describe('login was not successfull', () => {
        it('renders a login error', async () => {
            mockAxios.onPost('/login').reply(401, { message: 'Login error' });
            renderComponent();
            const inputContainers = screen.getAllByTestId('input');
            const inputs = inputContainers.map(container => container.querySelector('input')) as HTMLInputElement[];
            fireEvent.change(inputs[0], { target: { value: 'test@gmail.com' } });
            fireEvent.change(inputs[1], { target: { value: 'qwerty123' } });
            const button = screen.getByText('Zaloguj się');
            await waitFor(() => {
                fireEvent.click(button);
            });
            const error = screen.getByRole('alert');
            expect(error).toHaveTextContent('Login error');
        });
    });

    describe('login was successfull', () => {
        it('saves access and refresh tokens to local storage', async () => {
            mockAxios.onPost('/login').reply(200, { accessToken: 'accessToken', refreshToken: 'refreshToken' });
            vi.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem');
            Object.setPrototypeOf(window.localStorage.setItem, vi.fn());
            renderComponent();
            const inputContainers = screen.getAllByTestId('input');
            const inputs = inputContainers.map(container => container.querySelector('input')) as HTMLInputElement[];
            fireEvent.change(inputs[0], { target: { value: 'test@gmail.com' } });
            fireEvent.change(inputs[1], { target: { value: 'qwerty123' } });
            const button = screen.getByText('Zaloguj się');
            await waitFor(() => {
                fireEvent.click(button);
            });
            expect(window.localStorage.setItem).toHaveBeenNthCalledWith(1, 'accessToken', 'accessToken');
            expect(window.localStorage.setItem).toHaveBeenNthCalledWith(2, 'refreshToken', 'refreshToken');
        });

        it('redirects to the feed page', async () => {
            mockAxios.onPost('/login').reply(200, { accessToken: 'accessToken', refreshToken: 'refreshToken' });
            renderComponent();
            const inputContainers = screen.getAllByTestId('input');
            const inputs = inputContainers.map(container => container.querySelector('input')) as HTMLInputElement[];
            fireEvent.change(inputs[0], { target: { value: 'test@gmail.com' } });
            fireEvent.change(inputs[1], { target: { value: 'qwerty123' } });
            const button = screen.getByText('Zaloguj się');
            await waitFor(() => {
                fireEvent.click(button);
            });
            const feedPage = screen.getByTestId('feedPage');
            expect(feedPage).toBeInTheDocument();
        });
    });

});