import { cleanup, render } from '@testing-library/react';
import { afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TypedResponse } from '../hooks/useApi.ts';

afterEach(() => {
  cleanup();
});

const queryClient = new QueryClient();

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

export type AxiosOverrides = Partial<{
  loading: boolean;
  data: unknown;
  error: string;
}>;

export const mockSuccess = <T,>(data: T): TypedResponse<T> =>
  new Promise((resolve, _) => {
    resolve({
      data,
      status: 200,
      statusText: 'success',
      headers: {}
    });
  });

export const mockError = <T,>(error: string): TypedResponse<T> =>
  Promise.reject({ message: error });

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
// override render export
export { customRender as render };
