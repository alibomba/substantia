import { fireEvent, render, screen } from '@testing-library/react';
import CreateChannel from './CreateChannel';

function renderComponent() {
    render(
        <CreateChannel
            setError={vi.fn()}
            setPopup={vi.fn()}
        />
    )
}

describe('CreateChannel', () => {
    it('renders create channel button', () => {
        renderComponent();
        const button = screen.getByText('Utwórz kanał');
        expect(button).toBeInTheDocument();
    });

    it('button click opens a modal form', () => {
        renderComponent();
        const button = screen.getByText('Utwórz kanał');
        fireEvent.click(button);
        const form = screen.getByTestId('createChannelForm');
        expect(form).toBeInTheDocument();
    });

    it('close button click closes a modal form', () => {
        renderComponent();
        const button = screen.getByText('Utwórz kanał');
        fireEvent.click(button);
        const closeButton = screen.getByTitle('Zamknij okno');
        fireEvent.click(closeButton);
        const form = screen.queryByTestId('createChannelForm');
        expect(form).not.toBeInTheDocument();
    });
});