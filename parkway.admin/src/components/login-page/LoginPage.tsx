import styles from './LoginPage.module.css';
import { Alert, Button, Card, Form, Image, Input } from 'antd';
import { InternalLoginResponse, useAuth } from '../../hooks/useAuth.tsx';
import {Link, useNavigate} from 'react-router-dom';
import useApi, { buildQueryKey } from '../../hooks/useApi.tsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LoginFields } from '../../api';
import { useState } from 'react';
import ProfileVerification from '../profile-verification';

const LoginPage = () => {
  const { login } = useAuth();

  const {
    generalApi: { getOrganizationId },
    usersApi: { login: loginFn },
    formatError
  } = useApi();

  const {
    data,
    error: organizationIdError,
    isLoading
  } = useQuery({
    queryFn: getOrganizationId,
    queryKey: buildQueryKey('organizationId')
  });

  const { mutate, error, isPending } = useMutation({ mutationFn: loginFn });
  const [loginResponse, setLoginResponse] = useState<InternalLoginResponse>();
  const navigate = useNavigate();

  const organizationId = data?.data;

  const handleLogin = (formFields: LoginFields) => {
    if (!organizationId) return;

    mutate(
      { ...formFields, organizationId },
      {
        onSuccess: ({ data }) => {
          const result = login(data);

          if (result.hasValidProfile) {
            navigate('/');
          } else {
            setLoginResponse(result);
          }
        }
      }
    );
  };

  if (loginResponse) {
    return <ProfileVerification loginResponse={loginResponse} />;
  }

  const disabled = isPending || isLoading || !organizationId;

  return (
    <div className="entryPage">
      <Card
        title="Parkway Ministries Admin Login"
        bordered={false}
        style={{ width: '90vw', maxWidth: 500 }}
      >
        <div className={styles.logoContainer}>
          <Image
            className={styles.logo}
            height={175}
            src="/logo.png"
            preview={false}
            alt="Parkway Ministries"
          />
        </div>
        {organizationIdError || (!organizationId && !isLoading) ? (
          <Alert
            className={styles.configError}
            type="error"
            message="Unable to load organization configuration."
          />
        ) : null}
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={handleLogin}
          autoComplete="off"
          disabled={disabled}
        >
          <Form.Item<LoginFields>
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

          <Form.Item<LoginFields>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isPending}
              loading={isPending}
            >
              Submit
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
          <Link to="/signup">Signup</Link> for an account.
        </p>
        <p>
          <Link to="/forgot">Forgot Password?</Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
