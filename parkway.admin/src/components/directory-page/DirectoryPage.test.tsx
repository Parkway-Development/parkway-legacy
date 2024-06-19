import { expect, test, describe, vi } from 'vitest';
import { DirectoryPage } from './DirectoryPages.tsx';
import {
  buildMocks,
  mockApi,
  MockApiType,
  render,
  screen
} from '../../test/utils';
import useApi from '../../hooks/useApi.tsx';
import { UserProfile } from '../../types';

vi.mock('../../hooks/useApi');

describe('Directory Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const setup = (overrides: MockApiType = {}) => {
    mockApi(useApi, {
      ...overrides
    });

    return render(<DirectoryPage />);
  };

  test('Shows page header', () => {
    setup();
    expect(screen.getByRole('heading', { name: 'Directory' })).toBeVisible();
  });

  test('Shows no data message', async () => {
    setup({ usersApi: { getAll: vi.fn().mockResolvedValue([]) } });
    expect(await screen.findByText(/no data/i)).toBeVisible();
  });

  test('Shows error message', async () => {
    const error = 'unknown error message to display';

    setup(buildMocks(['usersApi', 'getAll', error]));

    expect(await screen.findByText(error)).toBeVisible();
  });

  test('Renders user table', async () => {
    const data: UserProfile[] = [
      {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        mobilePhone: '123-456-7890',
        member: true
      },
      {
        _id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        mobilePhone: '444-456-7890',
        member: true
      }
    ];

    const overrides = buildMocks(['usersApi', 'getAll', data]);

    setup(overrides);

    expect(await screen.findByText('Total Count: 2')).toBeVisible();

    data.forEach((user) => {
      expect(screen.getByText(new RegExp(user.firstName!))).toBeVisible();
      expect(screen.getByText(new RegExp(user.lastName!))).toBeVisible();
    });
  });
});
