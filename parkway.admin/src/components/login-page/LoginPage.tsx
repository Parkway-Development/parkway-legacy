import styles from './LoginPage.module.css';
import { Alert, Button, Card, Form, Input } from 'antd';
import { AuthUser, useAuth } from '../../hooks/useAuth.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '../../hooks/useAxios.ts';

interface LoginFields {
  email: string;
  password: string;
}

interface LoginResponse {
  email: string;
  _id: string;
}

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { loading, error, post } =
    useMutation<LoginResponse>('/api/user/login');

  const handleLogin = async (formFields: LoginFields) => {
    const response = await post(formFields);

    if (response) {
      const { data } = response;
      const user: AuthUser = {
        id: data._id,
        name: 'Test User',
        email: data.email
      };

      login(user);
      navigate('/');
    }
  };

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
          disabled={loading}
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
              disabled={loading}
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
        {error && (
          <Alert className={styles.error} message={error} type="error" />
        )}
        <p>
          <Link to="/signup">Signup</Link> for an account.
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
