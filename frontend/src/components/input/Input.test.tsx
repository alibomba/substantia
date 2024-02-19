import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Input from './Input';

function renderComponent() {
    render(
        <Input
            id='123'
            type='email'
            label='E-mail'
            placeholder='test@gmail.com'
            minLength={3}
            maxLength={20}
            onChange={vi.fn()}
            value='test'
            required={true}
            width='50%'
        />
    )
}

function renderEmptyComponent() {
    render(
        <Input
            id='123'
            type='email'
            label='E-mail'
            placeholder='test@gmail.com'
            minLength={3}
            maxLength={20}
            onChange={vi.fn()}
            value=''
            required={true}
            width='50%'
        />
    )
}

describe('Input', () => {
    it('renders input with all props correctly', () => {
        renderComponent();
        const input = screen.getByRole('textbox') as HTMLInputElement;
        const label = screen.getByTestId('label');
        expect(input).toBeInTheDocument();
        expect(label).toHaveTextContent('E-mail');
        expect(input.id).toBe('123');
        expect(input.type).toBe('email');
        expect(input.ariaLabel).toBe('E-mail');
        expect(input.placeholder).toBe('');
        expect(input.minLength).toBe(3);
        expect(input.maxLength).toBe(20);
        expect(input.value).toBe('test');
        expect(input.required).toBe(true);
        expect(input.closest('div')).toHaveStyle({ width: '50%' });
    });

    it('focuses with animation', () => {
        renderEmptyComponent();
        const input = screen.getByRole('textbox') as HTMLInputElement;
        fireEvent.focus(input);
        const label = screen.getByTestId('label');
        expect(label).toHaveClass('-translate-y-12 text-3xl');
        expect(label).not.toHaveClass('text-5xl');
    });

    it('unfocuses with animation', () => {
        renderEmptyComponent();
        const input = screen.getByRole('textbox') as HTMLInputElement;
        const label = screen.getByTestId('label');
        fireEvent.focus(input);
        fireEvent.blur(input);
        expect(label).toHaveClass('text-5xl');
        expect(label).not.toHaveClass('-translate-y-12 text-3xl');
    });

    it('doesnt perform animation when input is not empty', () => {
        renderEmptyComponent();
        const input = screen.getByRole('textbox') as HTMLInputElement;
        const label = screen.getByTestId('label');
        fireEvent.focus(input);
        input.value = 'test value';
        fireEvent.blur(input);
        expect(label).toHaveClass('-translate-y-12 text-3xl');
        expect(label).not.toHaveClass('text-5xl');
    });
});
