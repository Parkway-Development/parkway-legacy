import { expect, test, describe, vi } from 'vitest';
import DirectoryPage from './DirectoryPage';
import { AxiosOverrides, mockGet, render, screen } from '../../test/utils';
import { useGet } from '../../hooks/useAxios';
import { UserProfile } from '../../types/UserProfile.ts';

vi.mock('../../hooks/useAxios');

describe('Directory Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const setup = (overrides: AxiosOverrides = {}) => {
    vi.mocked(useGet).mockReturnValue(mockGet(overrides));
    return render(<DirectoryPage />);
  };

  test('Shows page header', () => {
    setup();
    expect(screen.getByRole('heading', { name: 'Directory' })).toBeVisible();
  });

  test('Shows no data message', () => {
    setup({ data: [] });
    expect(screen.getByText(/no data/i)).toBeVisible();
  });

  test('Shows error message', () => {
    const error = 'unknown error message to display';
    setup({ error });
    expect(screen.getByText(error)).toBeVisible();
  });

  test('Shows loading spinner', () => {
    const { container } = setup({ loading: true });
    const spinners = container.getElementsByClassName('ant-spin-dot');
    expect(spinners).length(1);
  });

  test('Renders user table', () => {
    const data: UserProfile[] = [
      { id: '1', firstname: 'John', lastname: 'Doe', mobile: '123-456-7890' },
      { id: '2', firstname: 'Jane', lastname: 'Smith', mobile: '444-456-7890' }
    ];

    setup({ data });

    expect(screen.getByText('Total Count: 2')).toBeVisible();

    data.forEach((user) => {
      expect(screen.getByText(user.firstname)).toBeVisible();
      expect(screen.getByText(user.lastname)).toBeVisible();
      expect(screen.getByText(user.mobile)).toBeVisible();
    });
  });
});
