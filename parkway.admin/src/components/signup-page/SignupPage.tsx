import styles from './SignupPage.module.css';
import { Alert, Button, Card, Form, Input } from 'antd';
import { AuthUser, useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '../../hooks/useAxios';

interface SignupFields {
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupResponse {
  email: string;
  _id: string;
}

const SignupPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { loading, error, post } =
    useMutation<SignupResponse>('/api/user/connect');

  const handleSignup = async ({ email, password }: SignupFields) => {
    const response = await post({ email, password });

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
          disabled={loading}
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
