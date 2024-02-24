import { expect, test, describe, vi } from 'vitest';
import SignupPage from './SignupPage';
import {
  mockMutation,
  MutationOverrides,
  render,
  screen,
  userEvent
} from '../../test/utils';
import { useMutation } from '../../hooks/useAxios';

const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  Link: () => <></>,
  useNavigate: () => mockedUsedNavigate
}));
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn()
  })
}));
vi.mock('../../hooks/useAxios');

describe('Signup Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const setup = (overrides: MutationOverrides = {}) => {
    vi.mocked(useMutation).mockReturnValue(mockMutation(overrides));
    return render(<SignupPage />);
  };

  test('Shows sign up form', () => {
    setup();
    expect(screen.getByText('Parkway Ministries Admin Signup')).toBeVisible();
    expect(screen.getByLabelText(/email/i)).toBeVisible();
    expect(screen.getByText(/^password/i)).toBeVisible();
    expect(screen.getByText(/confirm password/i)).toBeVisible();
    expect(screen.getByRole('button', { name: /signup/i })).toBeVisible();
  });

  test('Shows errors', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: /signup/i }));
    const results = screen.getAllByText('Required');
    expect(results).toHaveLength(3);
  });

  test('Require valid email', async () => {
    setup();
    await userEvent.type(screen.getByLabelText(/email/i), 'invalidemail');
    await userEvent.click(screen.getByRole('button', { name: /signup/i }));
    expect(await screen.findByText(/invalid email/i)).toBeVisible();
  });

  test('Require password of at least 8 characters', async () => {
    setup();
    await userEvent.type(screen.getByLabelText(/^password/i), 'abc');
    await userEvent.click(screen.getByRole('button', { name: /signup/i }));
    expect(
      await screen.findByText(/must be at least 8 characters/i)
    ).toBeVisible();
  });

  test('Require passwords to match', async () => {
    setup();
    await userEvent.type(screen.getByLabelText(/^password/i), 'abcd1234');
    await userEvent.type(
      screen.getByLabelText(/^confirm password/i),
      'abcd12345'
    );
    await userEvent.click(screen.getByRole('button', { name: /signup/i }));
    expect(await screen.findByText(/passwords must match/i)).toBeVisible();
  });

  test('Display email already exists error', async () => {
    setup({ error: 'Email already exists ' });
    expect(await screen.findByText(/email already exists/i)).toBeVisible();
  });

  test('Can submit form', async () => {
    const mockPost = vi.fn();
    setup({ post: mockPost });
    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/^password/i), 'abcd1234');
    await userEvent.type(
      screen.getByLabelText(/^confirm password/i),
      'abcd1234'
    );

    expect(mockPost).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: /signup/i }));
    expect(mockPost).toHaveBeenCalledOnce();
  });
});
