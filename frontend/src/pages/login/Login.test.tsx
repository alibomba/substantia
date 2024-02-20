import { render, screen } from '@testing-library/react';
import Login from './Login';
import { AuthProvider } from '../../contexts/AuthProvider';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import axiosClient from '../../axiosClient';

const mockAxios = new MockAdapter(axiosClient);
vi.mock('../../components/googleLogin/GoogleLogin');

function renderComponent() {
    render(
        <AuthProvider>
            <MemoryRouter initialEntries={['/logowanie']}>
                <Routes>
                    <Route path='/logowanie' element={<Login />} />
                    <Route path='/feed' element={<div data-testid='feedPage'></div>} />
                </Routes>
            </MemoryRouter>
        </AuthProvider>
    );
}

beforeEach(() => {
    vi.resetAllMocks();
});

describe('Login', () => {
    describe('user is not authorized', () => {
        it('renders the login page', async () => {
            mockAxios.onGet('/auth').reply(401);
            renderComponent();
            const loading = screen.getByTestId('loading');
            expect(loading).toBeInTheDocument();
            const loginPage = await screen.findByTestId('login');
            expect(loginPage).toBeInTheDocument();
        });
    });

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

});