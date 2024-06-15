import { cleanup, render } from '@testing-library/react';
import { afterEach, Mock, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiType, TypedResponse } from '../hooks/useApi.ts';
import {
  AccountsApiType,
  AssetsApiType,
  AttendanceApiType,
  BaseApiType,
  ContributionsApiType,
  EnumsApiType,
  EventCategoriesApiType,
  EventsApiType,
  GeneralApiType,
  SongsApiType,
  TeamsApiType,
  UsersApiType,
  VendorsApiType
} from '../api';
import {
  Account,
  Asset,
  Attendance,
  BaseEntity,
  Contribution,
  Enum,
  Event,
  EventCategory,
  Song,
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
  attendanceApi: Partial<AttendanceApiType>;
  contributionsApi: Partial<ContributionsApiType>;
  enumsApi: Partial<EnumsApiType>;
  eventCategoriesApi: Partial<EventCategoriesApiType>;
  eventsApi: Partial<EventsApiType>;
  generalApi: Partial<GeneralApiType>;
  songsApi: Partial<SongsApiType>;
  teamsApi: Partial<TeamsApiType>;
  usersApi: Partial<UsersApiType>;
  vendorsApi: Partial<VendorsApiType>;
}>;

export const mockApi = (
  useApiFn: () => ApiType,
  {
    accountsApi,
    assetsApi,
    attendanceApi,
    contributionsApi,
    enumsApi,
    eventCategoriesApi,
    eventsApi,
    generalApi,
    songsApi,
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
      getAllLimitedProfile: vi.fn(),
      requestPasswordReset: vi.fn(),
      passwordReset: vi.fn(),
      ...usersApi
    },
    accountsApi: {
      ...mockBaseApi<Account>(accountsApi),
      updateCustodian: vi.fn(),
      addParent: vi.fn(),
      addChildren: vi.fn()
    },
    assetsApi: mockBaseApi<Asset>(assetsApi),
    attendanceApi: mockBaseApi<Attendance>(attendanceApi),
    contributionsApi: mockBaseApi<Contribution>(contributionsApi),
    enumsApi: mockBaseApi<Enum>(enumsApi),
    eventCategoriesApi: mockBaseApi<EventCategory>(eventCategoriesApi),
    eventsApi: {
      ...mockBaseApi<Event>(eventsApi),
      addMessage: vi.fn(),
      reject: vi.fn(),
      approve: vi.fn(),
      deleteBySchedule: vi.fn(),
      register: vi.fn(),
      getRegistrations: vi.fn()
    },
    songsApi: mockBaseApi<Song>(songsApi),
    teamsApi: mockBaseApi<Team>(teamsApi),
    generalApi: {
      getPasswordSettings: vi.fn(),
      getOrganizationId: vi.fn(),
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
> = T[K1][K2] extends (...args: unknown[]) => unknown
  ? ReturnType<T[K1][K2]>
  : never;

const buildResolvedMock = <
  K extends keyof ApiType,
  K2 extends keyof ApiType[K]
>(
  _: K,
  __: K2,
  resolvedValue: ExtractDataType<ExtractReturnType<ApiType, K, K2>>
): Mock => {
  const mock = vi.fn<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // @ts-expect-error required for mocking
      overrides[key][key2] = vi.fn().mockRejectedValue({ message: data });
    } else {
      // @ts-expect-error required for mocking
      overrides[key][key2] = buildResolvedMock(key, key2, data);
    }
  });

  return overrides;
};
