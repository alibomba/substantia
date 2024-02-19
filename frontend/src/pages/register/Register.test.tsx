import { render, screen } from '@testing-library/react';
import { Register } from '..';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import axiosClient from '../../axiosClient';
import { AuthProvider } from '../../contexts/AuthProvider';

const mockAxios = new MockAdapter(axiosClient);

vi.mock('../../components/googleLogin/GoogleLogin');

beforeEach(() => {
    vi.resetAllMocks();
});

function renderComponent() {
    render(
        <AuthProvider>
            <MemoryRouter initialEntries={['/rejestracja']}>
                <Routes>
                    <Route path='/feed' element={<div data-testid='feedPage'></div>} />
                    <Route path='/rejestracja' element={<Register />} />
                </Routes>
            </MemoryRouter>
        </AuthProvider>
    );
}

describe('Register', () => {
    describe('user is authorized', () => {
        it('redirects to the feed page', async () => {
            mockAxios.onGet('/auth').reply(200);
            renderComponent();
            const loading = screen.getByTestId('loading');
            expect(loading).toBeInTheDocument();
            const feedPage = await screen.findByTestId('feedPage');
            expect(feedPage).toBeInTheDocument();
        });
    });

    describe('user is unauthorized', () => {
        it('renders the register page', async () => {
            mockAxios.onGet('/auth').reply(401);
            renderComponent();
            const loading = screen.getByTestId('loading');
            expect(loading).toBeInTheDocument();
            const registerPage = await screen.findByTestId('register');
            expect(registerPage).toBeInTheDocument();
        });
    });
});