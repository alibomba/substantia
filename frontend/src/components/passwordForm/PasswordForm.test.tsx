import { render, screen } from '@testing-library/react';
import PasswordForm from './PasswordForm';
import MockAdapter from 'axios-mock-adapter';
import axiosClient from '../../axiosClient';

const mockAxios = new MockAdapter(axiosClient);

beforeEach(() => {
    vi.resetAllMocks();
});

function renderComponent() {
    render(
        <PasswordForm
            setError={vi.fn()}
            setPopup={vi.fn()}
        />
    )
}

describe('PasswordForm', () => {
    describe('user has oauth', () => {
        it('does not render anything', async () => {
            mockAxios.onGet('/check-oauth').reply(200, { hasOAuth: true });
            renderComponent();
            const nothing = await screen.findByTestId('noPasswordForm');
            expect(nothing).toBeInTheDocument();
        });
    });

    describe('user has no oauth', () => {
        it('renders a form', async () => {
            mockAxios.onGet('/check-oauth').reply(200, { hasOAuth: false });
            renderComponent();
            const form = await screen.findByTestId('passwordForm');
            expect(form).toBeInTheDocument();
        });
    });
});