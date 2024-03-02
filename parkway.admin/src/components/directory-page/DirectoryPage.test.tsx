import { expect, test, describe, vi } from 'vitest';
import DirectoryPage from './DirectoryPage';
import { buildMocks, mockApi, render, screen } from '../../test/utils';
import useApi, { ApiType } from '../../hooks/useApi';
import { UserProfile } from '../../types/UserProfile';

vi.mock('../../hooks/useApi');

describe('Directory Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const setup = (overrides: Partial<ApiType> = {}) => {
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
    setup({ getUserProfiles: vi.fn().mockResolvedValue([]) });
    expect(await screen.findByText(/no data/i)).toBeVisible();
  });

  test('Shows error message', async () => {
    const error = 'unknown error message to display';

    setup(buildMocks(['getUserProfiles', error]));

    expect(await screen.findByText(error)).toBeVisible();
  });

  test('Renders user table', async () => {
    const data: UserProfile[] = [
      {
        _id: '1',
        firstname: 'John',
        lastname: 'Doe',
        mobile: '123-456-7890',
        member: true,
        status: 'active',
        applicationrole: 'none'
      },
      {
        _id: '2',
        firstname: 'Jane',
        lastname: 'Smith',
        mobile: '444-456-7890',
        member: true,
        status: 'active',
        applicationrole: 'none'
      }
    ];

    const overrides = buildMocks(['getUserProfiles', data]);

    setup(overrides);

    expect(await screen.findByText('Total Count: 2')).toBeVisible();

    data.forEach((user) => {
      expect(screen.getByText(user.firstname!)).toBeVisible();
      expect(screen.getByText(user.lastname!)).toBeVisible();
      expect(screen.getByText(user.mobile!)).toBeVisible();
    });
  });
});
