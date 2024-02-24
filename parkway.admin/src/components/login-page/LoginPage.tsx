import styles from './LoginPage.module.css';
import { Button, Card, Form, Input } from 'antd';
import { AuthUser, useAuth } from '../../hooks/useAuth.tsx';
import { Link, useNavigate } from 'react-router-dom';

interface LoginFields {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (formFields: LoginFields) => {
    const user: AuthUser = {
      name: 'Temp User',
      email: formFields.email
    };

    login(user);
    navigate('/');
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
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <p>
          <Link to="/signup">Signup</Link> for an account.
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
