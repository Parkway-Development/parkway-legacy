import { cleanup, render } from '@testing-library/react';
import { afterEach, Mock, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiType, TypedResponse } from '../hooks/useApi.ts';

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
    getTeamById: vi.fn(),
    login: vi.fn(),
    signup: vi.fn(),
    updateTeam: vi.fn(),
    ...overrides
  });
};

type ExtractDataType<T> =
  T extends TypedResponse<infer TValue> ? TValue : never;

const buildResolvedMock = <K extends keyof ApiType>(
  _: K,
  resolvedValue: ExtractDataType<ReturnType<ApiType[K]>>
): Mock => {
  const mock = vi.fn<
    any,
    TypedResponse<ExtractDataType<ReturnType<ApiType[K]>>>
  >();
  mock.mockResolvedValue({
    data: resolvedValue,
    status: 200,
    statusText: 'OK',
    headers: {}
  });
  return mock;
};

export const buildMocks = <K extends keyof ApiType>(
  ...mocks: [K, ExtractDataType<ReturnType<ApiType[K]>> | string][]
): Partial<ApiType> => {
  const overrides: Partial<ApiType> = {};

  mocks.forEach(([key, data]) => {
    // noinspection SuspiciousTypeOfGuard
    if (typeof data === 'string') {
      overrides[key] = vi.fn().mockRejectedValue({ message: data });
    } else {
      overrides[key] = buildResolvedMock(key, data);
    }
  });

  return overrides;
};
