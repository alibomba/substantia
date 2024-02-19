import { render, screen } from '@testing-library/react';
import Error from './Error';

describe('Error', () => {
    it('renders error', () => {
        render(<Error />);
        const error = screen.getByRole('alert');
        expect(error).toBeInTheDocument();
        expect(error).toHaveTextContent('Coś poszło nie tak, spróbuj ponownie później...');
    });
});
