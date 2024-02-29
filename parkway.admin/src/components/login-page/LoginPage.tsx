import styles from './LoginPage.module.css';
import { Alert, Button, Card, Form, Input } from 'antd';
import { useAuth } from '../../hooks/useAuth.tsx';
import { Link } from 'react-router-dom';
import useApi from '../../hooks/useApi.ts';
import { useMutation } from '@tanstack/react-query';
import { LoginFields } from '../../api/userApi.ts';

const LoginPage = () => {
  const { login } = useAuth();
  const { login: loginFn, formatError } = useApi();
  const { mutate, error, isPending } = useMutation({ mutationFn: loginFn });

  const handleLogin = (formFields: LoginFields) =>
    mutate(formFields, {
      onSuccess: ({ data }) => login(data)
    });

  return (
    <div className={styles.page}>
      <Card
        title="Parkway Ministries Admin Login"
        bordered={false}
        style={{ width: 500 }}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={handleLogin}
          autoComplete="off"
          disabled={isPending}
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
      </Card>
    </div>
  );
};

export default LoginPage;
