import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Search } from '../../pages';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import axiosClient from '../../axiosClient';

const mockAxios = new MockAdapter(axiosClient);

const mockProfile: ProfileResult = {
    id: '123',
    username: 'TestUser',
    slug: 'testuser',
    avatar: null,
    description: 'test description'
}

function renderComponent() {
    render(
        <MemoryRouter>
            <Search />
        </MemoryRouter>
    )
}

beforeEach(() => {
    vi.resetAllMocks();
});

describe('Search', () => {
    it('renders search form', () => {
        renderComponent();
        const form = screen.getByTestId('searchForm');
        expect(form).toBeInTheDocument();
    });

    it('renders results', async () => {
        mockAxios.onGet('/search?phrase=searchphrase').reply(200, [mockProfile, mockProfile]);
        renderComponent();
        const form = screen.getByTestId('searchForm');
        const input = form.querySelector('input') as HTMLInputElement;
        const button = form.querySelector('button') as HTMLButtonElement;
        fireEvent.change(input, { target: { value: 'searchphrase' } });
        await waitFor(() => {
            fireEvent.click(button);
        });
        const results = screen.getAllByTestId('profileResult');
        expect(results.length).toBe(2);
    });

    it('renders no results text', async () => {
        mockAxios.onGet('/search?phrase=searchphrase').reply(200, []);
        renderComponent();
        const form = screen.getByTestId('searchForm');
        const input = form.querySelector('input') as HTMLInputElement;
        const button = form.querySelector('button') as HTMLButtonElement;
        fireEvent.change(input, { target: { value: 'searchphrase' } });
        await waitFor(() => {
            fireEvent.click(button);
        });
        const noResults = screen.getByText('Brak wyników');
        expect(noResults).toBeInTheDocument();
    });
});