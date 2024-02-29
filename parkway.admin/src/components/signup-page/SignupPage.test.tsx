import { expect, test, describe, vi } from 'vitest';
import SignupPage, { DefaultPasswordSettings } from './SignupPage';
import {
  buildMocks,
  mockApi,
  render,
  screen,
  userEvent
} from '../../test/utils';
import useApi, { ApiType } from '../../hooks/useApi';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn()
  })
}));
vi.mock('../../hooks/useApi');

describe('Signup Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const setup = (overrides: Partial<ApiType> = {}) => {
    mockApi(useApi, {
      ...buildMocks(['getPasswordSettings', DefaultPasswordSettings]),
      ...overrides
    });

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

  test('Requires strong password', async () => {
    setup();
    await userEvent.type(screen.getByLabelText(/^password/i), 'abc');
    await userEvent.click(screen.getByRole('button', { name: /signup/i }));
    expect(await screen.findByText(/minimum length: 12/i)).toBeVisible();
    expect(screen.getByText(/minimum uppercase: 1/i)).toBeVisible();
    expect(screen.getByText(/minimum lowercase: 1/i)).toBeVisible();
    expect(screen.getByText(/minimum numbers: 1/i)).toBeVisible();
    expect(screen.getByText(/minimum symbols: 1/i)).toBeVisible();
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
    const error = 'Email already exists';
    const overrides = buildMocks(['signup', error]);
    setup(overrides);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/^password/i), 'abcd1234#ABC');
    await userEvent.type(
      screen.getByLabelText(/^confirm password/i),
      'abcd1234#ABC'
    );

    expect(overrides.signup).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /signup/i })).toBeEnabled();
    await userEvent.click(screen.getByRole('button', { name: /signup/i }));
    expect(await screen.findByText(/email already exists/i)).toBeVisible();
    expect(overrides.signup).toHaveBeenCalledOnce();
  });

  test('Can submit form', async () => {
    const overrides = buildMocks([
      'signup',
      { email: 'test@test.com', token: '1234' }
    ]);
    setup(overrides);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/^password/i), 'abcd1234#ABC');
    await userEvent.type(
      screen.getByLabelText(/^confirm password/i),
      'abcd1234#ABC'
    );

    expect(overrides.signup).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: /signup/i }));
    expect(overrides.signup).toHaveBeenCalledOnce();
  });
});
