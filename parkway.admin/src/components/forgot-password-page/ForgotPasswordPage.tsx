import styles from './ForgotPasswordPage.module.css';
import { Alert, Button, Card, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import useApi from '../../hooks/useApi.tsx';
import { useMutation } from '@tanstack/react-query';
import { ReactNode } from 'react';

interface ForgotPasswordFields {
  email: string;
}

const ForgotPasswordPage = () => {
  const {
    usersApi: { requestPasswordReset },
    formatError
  } = useApi();
  const { isPending, error, mutate, data } = useMutation({
    mutationFn: requestPasswordReset
  });

  const handleSubmit = ({ email }: ForgotPasswordFields) => mutate({ email });

  let content: ReactNode;

  if (data) {
    content = <span>{data.data.message}</span>;
  } else {
    content = (
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleSubmit}
        autoComplete="off"
        disabled={isPending}
      >
        <Form.Item<ForgotPasswordFields>
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

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={isPending}
            loading={isPending}
          >
            Email Me
          </Button>
        </Form.Item>
      </Form>
    );
  }

  return (
    <div className="entryPage">
      <Card
        title="Parkway Ministries Admin Forgot Password"
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
          <Link to="/login">Back to Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
