import styles from './SignupPage.module.css';
import { Button, Card, Form, Input } from 'antd';
import { AuthUser, useAuth } from '../../hooks/useAuth.tsx';
import { Link, useNavigate } from 'react-router-dom';

interface SignupFields {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = (formFields: SignupFields) => {
    const user: AuthUser = {
      name: 'Test User',
      email: formFields.email
    };

    login(user);
    navigate('/');
  };

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
              { min: 8, message: 'Password must be at least 8 characters.' }
            ]}
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
            <Button type="primary" htmlType="submit">
              Signup
            </Button>
          </Form.Item>
        </Form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default SignupPage;
