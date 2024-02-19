import { render, screen } from '@testing-library/react';
import Popup from './Popup';

function renderInactivePopup() {
    render(
        <Popup active={false} type='good'>Testowy popup</Popup>
    );
}

function renderGoodPopup() {
    render(
        <Popup active={true} type='good'>Testowy popup</Popup>
    );
}

function renderBadPopup() {
    render(
        <Popup active={true} type='bad'>Testowy popup</Popup>
    );
}

describe('Popup', () => {
    describe('inactive popup', () => {
        it('renders popup', () => {
            renderInactivePopup();
            const popup = screen.getByRole('alert');
            expect(popup).toBeInTheDocument();
        });

        it('sets correct translate', () => {
            renderInactivePopup();
            const popup = screen.getByRole('alert');
            expect(popup).toHaveClass('translate-x-[200%]');
        });
    });

    describe('good popup', () => {
        it('renders popup', () => {
            renderGoodPopup();
            const popup = screen.getByRole('alert');
            expect(popup).toBeInTheDocument();
        });

        it('sets correct translate', () => {
            renderGoodPopup();
            const popup = screen.getByRole('alert');
            expect(popup).toHaveClass('translate-x-0');
        });

        it('sets correct color', () => {
            renderGoodPopup();
            const popup = screen.getByRole('alert');
            expect(popup).toHaveClass('bg-[rgba(0,255,0,.85)]');
        });
    });

    describe('bad popup', () => {
        it('renders popup', () => {
            renderBadPopup();
            const popup = screen.getByRole('alert');
            expect(popup).toBeInTheDocument();
        });

        it('sets correct translate', () => {
            renderBadPopup();
            const popup = screen.getByRole('alert');
            expect(popup).toHaveClass('translate-x-0');
        });

        it('sets correct color', () => {
            renderBadPopup();
            const popup = screen.getByRole('alert');
            expect(popup).toHaveClass('bg-[rgba(255,0,0,.85)]');
        });
    });
});
