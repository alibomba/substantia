import { render, screen } from '@testing-library/react';
import ProfileVideoForm from './ProfileVideoForm';

function renderComponent() {
    render(
        <ProfileVideoForm
            setError={vi.fn()}
            setPopup={vi.fn()}
        />
    )
}

describe('ProfileVideoForm', () => {
    it('renders the label', () => {
        renderComponent();
        const label = screen.getByTitle('Edytuj filmik profilowy');
        expect(label).toBeInTheDocument();
    });

    it('renders the text', () => {
        renderComponent();
        const text = screen.getByText('Zmień filmik profilowy');
        expect(text).toBeInTheDocument();
    });
});