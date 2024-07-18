import styles from './ResetPasswordPage.module.css';
import { Alert, Button, Card, Form, Input } from 'antd';
import { Link, useParams } from 'react-router-dom';
import useApi, { buildQueryKey } from '../../hooks/useApi.tsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PasswordSettings } from '../../api';
import { ReactNode } from 'react';

interface ResetPasswordFields {
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

type ResetPasswordPageParams = {
  resetToken: string;
};

const ResetPasswordPage = () => {
  const { resetToken } = useParams<ResetPasswordPageParams>();
  const {
    generalApi: { getPasswordSettings },
    usersApi: { passwordReset },
    formatError
  } = useApi();
  const { data: passwordSettings, isPending: passwordSettingsLoading } =
    useQuery({
      queryFn: getPasswordSettings,
      queryKey: buildQueryKey('passwordSettings')
    });
  const { isPending, error, mutate, data } = useMutation({
    mutationFn: passwordReset
  });

  const settings = passwordSettings?.data
    ? passwordSettings?.data
    : DefaultPasswordSettings;

  const passwordRegex = new RegExp(
    `^(?=.*[a-z]){${settings.minimumLowercase},}(?=.*[A-Z]){${settings.minimumUppercase},}(?=.*\\d){${settings.minimumNumbers},}(?=.*[-#!$@£%^&*()_+|~=\`{}\\[\\]:";'<>?,.\\/ ]){${settings.minimumSymbols},}[A-Za-z\\d-#!$@£%^&*()_+|~=\`{}\\[\\]:";'<>?,.\\/ ]{${settings.minimumLength},}$`
  );

  let content: ReactNode;

  if (!resetToken) {
    content = <span>Invalid password reset request.</span>;
  } else if (data) {
    content = <span>{data.data.message}</span>;
  } else {
    const handleSubmit = ({ password }: ResetPasswordFields) =>
      mutate({ password, resetToken });

    content = (
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleSubmit}
        autoComplete="off"
        disabled={isPending}
      >
        <Form.Item<ResetPasswordFields>
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

        <Form.Item<ResetPasswordFields>
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
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    );
  }

  return (
    <div className="entryPage">
      <Card
        title="Parkway Ministries Admin Reset Password"
        bordered={false}
        style={{ width: '90vw', maxWidth: 500 }}
      >
        {content}
        {error && (
          <Alert
            className={styles.error}
            message={formatError(error)}
            type="error"
          />
        )}
        <p>
          <Link to="/login">Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
