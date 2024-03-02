import { fireEvent, render, screen } from '@testing-library/react';
import SubscribeButton from './SubscribeButton';
import MockAdapter from 'axios-mock-adapter';
import axiosClient from '../../axiosClient';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthProvider';

const mockAxios = new MockAdapter(axiosClient);

function renderSubscribed() {
    render(
        <AuthProvider>
            <MemoryRouter>
                <Routes>
                    <Route path='/' element={
                        <SubscribeButton
                            id='123'
                            isSubscribed={true}
                            setIsSubscribed={vi.fn()}
                            subscriptionPrice={1299}
                        />
                    } />
                    <Route path='/logowanie' element={<div data-testid='loginPage'></div>} />
                </Routes>
            </MemoryRouter>
        </AuthProvider>
    )
}

function renderUnsubscribed() {
    render(
        <AuthProvider>
            <MemoryRouter>
                <Routes>
                    <Route path='/' element={
                        <SubscribeButton
                            id='123'
                            isSubscribed={false}
                            setIsSubscribed={vi.fn()}
                            subscriptionPrice={1299}
                        />
                    } />
                    <Route path='/logowanie' element={<div data-testid='loginPage'></div>} />
                </Routes>
            </MemoryRouter>
        </AuthProvider>
    )
}


beforeEach(() => {
    vi.resetAllMocks();
});

describe('SubscribeButton', () => {
    describe('unsubscribed state', () => {
        it('renders a button with correct content', () => {
            renderUnsubscribed();
            const button = screen.getByRole('button');
            const spans = button.children;
            expect(button).toBeInTheDocument();
            expect(spans[0]).toHaveTextContent('Subskrybuj');
            expect(spans[1]).toHaveTextContent('12.99zł');
        });

        it('unauthorized attempt to subscribe', async () => {
            mockAxios.onGet('/auth').reply(401);
            renderUnsubscribed();
            const button = screen.getByRole('button');
            fireEvent.click(button);
            const loginPage = screen.getByTestId('loginPage');
            expect(loginPage).toBeInTheDocument();
        });
    });

    describe('subscribed state', () => {
        it('renders a button with correct content', () => {
            renderSubscribed();
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
            expect(button).toHaveTextContent('Anuluj subskrypcję');
        });

        it('unauthorized attempt to unsubscribe', async () => {
            mockAxios.onGet('/auth').reply(401);
            renderSubscribed();
            const button = screen.getByRole('button');
            fireEvent.click(button);
            const loginPage = screen.getByTestId('loginPage');
            expect(loginPage).toBeInTheDocument();
        });
    });
});