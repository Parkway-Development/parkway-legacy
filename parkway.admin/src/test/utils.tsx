import { cleanup, render } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiType } from '../hooks/useApi.ts';

afterEach(() => {
  cleanup();
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => (
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    ),
    ...options
  });

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
// override render export
export { customRender as render };

export const mockApi = (
  useApiFn: () => ApiType,
  overrides: Partial<ApiType> = {}
) => {
  vi.mocked(useApiFn).mockReturnValue({
    formatError: (error) => error?.message ?? 'unknown error',
    createTeam: vi.fn(),
    deleteTeam: vi.fn(),
    getPasswordSettings: vi.fn(),
    getProfiles: vi.fn(),
    getTeams: vi.fn(),
    login: vi.fn(),
    signup: vi.fn(),
    ...overrides
  });
};
