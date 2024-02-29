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
    setup({ getProfiles: vi.fn().mockResolvedValue([]) });
    expect(await screen.findByText(/no data/i)).toBeVisible();
  });

  test('Shows error message', async () => {
    const error = 'unknown error message to display';

    setup(buildMocks(['getProfiles', error]));

    expect(await screen.findByText(error)).toBeVisible();
  });

  test('Renders user table', async () => {
    const data: UserProfile[] = [
      { id: '1', firstname: 'John', lastname: 'Doe', mobile: '123-456-7890' },
      { id: '2', firstname: 'Jane', lastname: 'Smith', mobile: '444-456-7890' }
    ];

    const overrides = buildMocks(['getProfiles', data]);

    setup(overrides);

    expect(await screen.findByText('Total Count: 2')).toBeVisible();

    data.forEach((user) => {
      expect(screen.getByText(user.firstname)).toBeVisible();
      expect(screen.getByText(user.lastname)).toBeVisible();
      expect(screen.getByText(user.mobile)).toBeVisible();
    });
  });
});
