import styles from './SignupPage.module.css';
import { Alert, Button, Card, Form, Input } from 'antd';
import { LoginResponse, useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useGet, useMutation } from '../../hooks/useAxios';

interface SignupFields {
  email: string;
  password: string;
  confirmPassword: string;
}

interface PasswordSettings {
  minimumLength: number;
  minimumLowercase: number;
  minimumUppercase: number;
  minimumNumbers: number;
  minimumSymbols: number;
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
  const navigate = useNavigate();
  const { data: passwordSettings, loading: passwordSettingsLoading } =
    useGet<PasswordSettings>('/api/setting/password');
  const { loading, error, post } =
    useMutation<LoginResponse>('/api/user/connect');

  const handleSignup = async ({ email, password }: SignupFields) => {
    const response = await post({ email, password });

    if (response) {
      login(response.data);
      navigate('/');
    }
  };

  const settings = passwordSettings
    ? passwordSettings
    : DefaultPasswordSettings;

  const passwordRegex = new RegExp(
    `^(?=.*[a-z]){${settings.minimumLowercase},}(?=.*[A-Z]){${settings.minimumUppercase},}(?=.*\\d){${settings.minimumNumbers},}(?=.*[-#!$@£%^&*()_+|~=\`{}\\[\\]:";'<>?,.\\/ ]){${settings.minimumSymbols},}[A-Za-z\\d-#!$@£%^&*()_+|~=\`{}\\[\\]:";'<>?,.\\/ ]{${settings.minimumLength},}$`
  );

  return (
    <div className={styles.page}>
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
          disabled={loading || passwordSettingsLoading}
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
              disabled={loading}
              loading={loading}
            >
              Signup
            </Button>
          </Form.Item>
        </Form>
        {error && (
          <Alert className={styles.error} message={error} type="error" />
        )}
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default SignupPage;
