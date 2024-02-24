import { cleanup, render } from '@testing-library/react';
import { afterEach } from 'vitest';
import { AxiosResponse } from 'axios';

afterEach(() => {
  cleanup();
});

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => children,
    ...options
  });

export type AxiosOverrides = Partial<{
  loading: boolean;
  data: unknown;
  error: string;
}>;

export type MutationOverrides = AxiosOverrides &
  Partial<{
    post: (payload: unknown) => Promise<AxiosResponse<any> | undefined>;
    put: (payload: unknown) => Promise<AxiosResponse<any> | undefined>;
    patch: (payload: unknown) => Promise<AxiosResponse<any> | undefined>;
    delete: () => Promise<AxiosResponse<any> | undefined>;
  }>;

export const mockGet = (overrides: AxiosOverrides = {}) => ({
  loading: false,
  data: undefined,
  error: undefined,
  ...overrides
});

export const mockMutation = (overrides: MutationOverrides = {}) => ({
  loading: false,
  data: undefined,
  error: undefined,
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  ...overrides
});

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
// override render export
export { customRender as render };
