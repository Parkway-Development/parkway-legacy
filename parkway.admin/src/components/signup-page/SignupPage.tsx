import styles from './SignupPage.module.css';
import { Alert, Button, Card, Form, Input } from 'antd';
import { InternalLoginResponse, useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import useApi, { buildQueryKey } from '../../hooks/useApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PasswordSettings } from '../../api';
import { useState } from 'react';
import ProfileVerification from '../profile-verification';

interface SignupFields {
  email: string;
  password: string;
  confirmPassword: string;
}

export const DefaultPasswordSettings: PasswordSettings = {
  minimumLength: 12,
  minimumLowercase: 1,
  minimumUppercase: 1,
  minimumNumbers: 1,
  minimumSymbols: 1
};

interface PasswordRequirementProps {
  count: number;
  display: string;
}

const PasswordRequirement = ({ count, display }: PasswordRequirementProps) => {
  if (count <= 0) return null;
  return (
    <li>
      {display}: {count}
    </li>
  );
};

const SignupPage = () => {
  const { login } = useAuth();
  const {
    generalApi: { getPasswordSettings },
    usersApi: { signup },
    formatError
  } = useApi();
  const { data: passwordSettings, isPending: passwordSettingsLoading } =
    useQuery({
      queryFn: getPasswordSettings,
      queryKey: buildQueryKey('passwordSettings')
    });
  const { isPending, error, mutate } = useMutation({
    mutationFn: signup
  });
  const [loginResponse, setLoginResponse] = useState<InternalLoginResponse>();

  const handleSignup = ({ email, password }: SignupFields) =>
    mutate(
      { email, password },
      {
        onSuccess: ({ data }) => {
          const result = login(data);

          if (result.hasValidProfile) {
            window.location.href = '/';
          } else {
            setLoginResponse(result);
          }
        }
      }
    );

  const settings = passwordSettings?.data
    ? passwordSettings?.data
    : DefaultPasswordSettings;

  const passwordRegex = new RegExp(
    `^(?=.*[a-z]){${settings.minimumLowercase},}(?=.*[A-Z]){${settings.minimumUppercase},}(?=.*\\d){${settings.minimumNumbers},}(?=.*[-#!$@£%^&*()_+|~=\`{}\\[\\]:";'<>?,.\\/ ]){${settings.minimumSymbols},}[A-Za-z\\d-#!$@£%^&*()_+|~=\`{}\\[\\]:";'<>?,.\\/ ]{${settings.minimumLength},}$`
  );

  if (loginResponse) {
    return <ProfileVerification loginResponse={loginResponse} />;
  }

  return (
    <div className="entryPage">
      <Card
        title="Parkway Ministries Admin Signup"
        bordered={false}
        style={{ width: 500 }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={handleSignup}
          autoComplete="off"
          disabled={isPending}
        >
          <Form.Item<SignupFields>
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Required' },
              { type: 'email', message: 'Invalid email' }
            ]}
            validateTrigger="onBlur"
          >
            <Input autoFocus />
          </Form.Item>

          <Form.Item<SignupFields>
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Required' },
              {
                pattern: passwordRegex,
                message: (
                  <ul>
                    Password Not Strong Enough
                    <PasswordRequirement
                      count={settings.minimumLength}
                      display="Minimum Length"
                    />
                    <PasswordRequirement
                      count={settings.minimumUppercase}
                      display="Minimum Uppercase"
                    />
                    <PasswordRequirement
                      count={settings.minimumLowercase}
                      display="Minimum Lowercase"
                    />
                    <PasswordRequirement
                      count={settings.minimumNumbers}
                      display="Minimum Numbers"
                    />
                    <PasswordRequirement
                      count={settings.minimumSymbols}
                      display="Minimum Symbols"
                    />
                  </ul>
                )
              }
            ]}
            validateTrigger="onBlur"
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<SignupFields>
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: 'Required' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Your passwords must match');
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isPending || passwordSettingsLoading}
              loading={isPending}
            >
              Signup
            </Button>
          </Form.Item>
        </Form>
        {error && (
          <Alert
            className={styles.error}
            message={formatError(error)}
            type="error"
          />
        )}
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default SignupPage;
