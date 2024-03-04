import { fireEvent, render, screen } from '@testing-library/react';
import SocialMediaForm from './SocialMediaForm';

function renderComponent() {
    render(
        <SocialMediaForm
            facebook={null}
            instagram='instagramURL'
            twitter='twitterURL'
            setSettings={vi.fn()}
            setError={vi.fn()}
            setPopup={vi.fn()}
        />
    )
}

describe('SocialMediaForm', () => {
    it('renders 3 buttons', () => {
        renderComponent();
        const buttons = screen.getAllByTestId('socialMediaButton');
        expect(buttons.length).toBe(3);
    });

    it('gives correct text color for buttons', () => {
        renderComponent();
        const buttons = screen.getAllByTestId('socialMediaButton');
        expect(buttons[0]).toHaveClass('text-black65');
        expect(buttons[1]).toHaveClass('text-primary');
        expect(buttons[2]).toHaveClass('text-primary');
    });

    it('on button click renders the modal form', () => {
        renderComponent();
        const buttons = screen.getAllByTestId('socialMediaButton');
        fireEvent.click(buttons[0]);
        const form = screen.getByTestId('socialMediaForm');
        expect(form).toBeInTheDocument();
    });

    it('on close button click hides the modal form', () => {
        renderComponent();
        const buttons = screen.getAllByTestId('socialMediaButton');
        fireEvent.click(buttons[0]);
        const form = screen.getByTestId('socialMediaForm');
        const closeButton = screen.getByTitle('Zamknij okno');
        fireEvent.click(closeButton);
        expect(form).not.toBeInTheDocument();
    });
});