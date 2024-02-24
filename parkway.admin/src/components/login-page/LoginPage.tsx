import styles from './LoginPage.module.css';
import { Button, Card, Form, Input } from 'antd';
import { AuthUser, useAuth } from '../../hooks/useAuth.tsx';
import { useNavigate } from 'react-router-dom';

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
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<LoginFields>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
