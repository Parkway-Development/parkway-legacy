import { cleanup, render } from '@testing-library/react';
import { afterEach, Mock, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiType, TypedResponse } from '../hooks/useApi.ts';
import {
  AccountsApiType,
  AssetsApiType,
  BaseApiType,
  ContributionsApiType,
  GeneralApiType,
  TeamsApiType,
  UsersApiType,
  VendorsApiType
} from '../api';
import {
  Account,
  Asset,
  BaseEntity,
  Contribution,
  Team,
  UserProfile,
  Vendor
} from '../types';

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

const mockBaseApi = <T extends BaseEntity>(
  overrides: Partial<BaseApiType<T>> = {}
): BaseApiType<T> => ({
  create: vi.fn(),
  delete: vi.fn(),
  getAll: vi.fn(),
  getById: vi.fn(),
  update: vi.fn(),
  ...overrides
});

export type MockApiType = Partial<{
  accountsApi: Partial<AccountsApiType>;
  assetsApi: Partial<AssetsApiType>;
  contributionsApi: Partial<ContributionsApiType>;
  generalApi: Partial<GeneralApiType>;
  teamsApi: Partial<TeamsApiType>;
  usersApi: Partial<UsersApiType>;
  vendorsApi: Partial<VendorsApiType>;
}>;

export const mockApi = (
  useApiFn: () => ApiType,
  {
    accountsApi,
    assetsApi,
    contributionsApi,
    generalApi,
    teamsApi,
    usersApi,
    vendorsApi,
    ...overrides
  }: MockApiType = {}
) => {
  vi.mocked(useApiFn).mockReturnValue({
    formatError: (error) => error?.message ?? 'unknown error',
    usersApi: {
      ...mockBaseApi<UserProfile>(usersApi),
      joinProfileAndUser: vi.fn(),
      login: vi.fn(),
      signup: vi.fn(),
      ...usersApi
    },
    accountsApi: mockBaseApi<Account>(accountsApi),
    assetsApi: mockBaseApi<Asset>(assetsApi),
    contributionsApi: mockBaseApi<Contribution>(contributionsApi),
    teamsApi: mockBaseApi<Team>(teamsApi),
    generalApi: {
      getPasswordSettings: vi.fn(),
      ...generalApi
    },
    vendorsApi: mockBaseApi<Vendor>(vendorsApi),
    ...overrides
  });
};

type ExtractDataType<T> =
  T extends TypedResponse<infer TValue> ? TValue : never;

type ExtractReturnType<
  T,
  K1 extends keyof T,
  K2 extends keyof T[K1]
> = T[K1][K2] extends (...args: any[]) => any ? ReturnType<T[K1][K2]> : never;

const buildResolvedMock = <
  K extends keyof ApiType,
  K2 extends keyof ApiType[K]
>(
  _: K,
  __: K2,
  resolvedValue: ExtractDataType<ExtractReturnType<ApiType, K, K2>>
): Mock => {
  const mock = vi.fn<
    any,
    TypedResponse<ExtractDataType<ExtractReturnType<ApiType, K, K2>>>
  >();
  mock.mockResolvedValue({
    data: resolvedValue,
    status: 200,
    statusText: 'OK',
    headers: {}
  });
  return mock;
};

export const buildMocks = <
  K1 extends keyof ApiType,
  K2 extends keyof ApiType[K1]
>(
  ...mocks: [
    K1,
    K2,
    ExtractDataType<ExtractReturnType<ApiType, K1, K2>> | string
  ][]
): MockApiType => {
  const overrides: MockApiType = {
    generalApi: {},
    usersApi: {}
  };

  mocks.forEach(([key, key2, data]) => {
    // noinspection SuspiciousTypeOfGuard
    if (typeof data === 'string') {
      // @ts-ignore
      overrides[key][key2] = vi.fn().mockRejectedValue({ message: data });
    } else {
      // @ts-ignore
      overrides[key][key2] = buildResolvedMock(key, key2, data);
    }
  });

  return overrides;
};
