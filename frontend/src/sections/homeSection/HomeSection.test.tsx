import { render, screen } from '@testing-library/react';
import { HomeSection } from '..';

function renderTextFirst() {
    render(
        <HomeSection
            heading='Nagłowek sekcji'
            text='Tekst sekcji'
            imageSrc='image-source.jpg'
            imageAlt='image alt text'
            textFirst={true}
        />
    );
}

function renderImageFirst() {
    render(
        <HomeSection
            heading='Nagłowek sekcji'
            text='Tekst sekcji'
            imageSrc='image-source.jpg'
            imageAlt='image alt text'
            textFirst={false}
        />
    );
}

describe('HomeSection', () => {
    describe('regular initial render', () => {
        it('renders all elements', () => {
            renderImageFirst();
            const image = screen.getByRole('img');
            const heading = screen.getByRole('heading');
            const text = screen.getByText('Tekst sekcji');
            expect(image).toBeInTheDocument();
            expect(heading).toBeInTheDocument();
            expect(text).toBeInTheDocument();
        });

        it('sets correct image attributes', () => {
            renderImageFirst();
            const image = screen.getByRole('img');
            expect(image.getAttribute('src')).toBe('image-source.jpg');
            expect(image.getAttribute('alt')).toBe('image alt text');
        });
    });

    describe('reversed layout', () => {
        it('renders elements in the reversed order', () => {
            renderTextFirst();
            const section = screen.getByTestId('homeSection');
            expect(section).toHaveClass('flex-row-reverse');
        });
    });

    describe('regular layout', () => {
        it('renders elements in the regular order', () => {
            renderImageFirst();
            const section = screen.getByTestId('homeSection');
            expect(section).not.toHaveClass('flex-row-reverse');
        });
    });
});