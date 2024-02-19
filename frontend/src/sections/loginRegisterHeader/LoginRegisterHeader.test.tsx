import { render, screen } from '@testing-library/react';
import { LoginRegisterHeader } from '..';

vi.mock('../../components/googleLogin/GoogleLogin');

function renderComponent() {
    render(
        <LoginRegisterHeader
            heading='Zarejestruj się'
            text='Zarejestruj się teraz, aby uzyskać dostęp do ekskluzywnych treści i dołączyć do naszej pasjonującej społeczności!'
            buttonContent='Zarejestruj się z Google'
        />
    )
}

describe('LoginRegisterHeader', () => {
    it('renders logo', () => {
        renderComponent();
        const logo = screen.getByTestId('logo');
        expect(logo).toBeInTheDocument();
    });

    it('renders heading', () => {
        renderComponent();
        const heading = screen.getByRole('heading');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Zarejestruj się');
    });

    it('renders text', () => {
        renderComponent();
        const text = screen.getByText(/Zarejestruj się teraz,*/);
        expect(text).toBeInTheDocument();
    });

    it('renders "lub" row', () => {
        renderComponent();
        const lub = screen.getByTestId('lub');
        expect(lub).toBeInTheDocument();
        expect(lub.childNodes.length).toBe(3);
    });
});
