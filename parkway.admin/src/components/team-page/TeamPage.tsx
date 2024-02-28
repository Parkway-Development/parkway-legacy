import { useMutation } from '../../hooks/useAxios';
import { Button, Form, Input, notification } from 'antd';
import { useEffect } from 'react';
import { Team } from '../../types/Team.ts';
import styles from './TeamPage.module.css';
import { Link, useNavigate } from 'react-router-dom';

interface TeamFields {
  name: string;
  description: string;
  leaderId: string;
  members: string[];
}

const TeamPage = () => {
  const { loading, error, post } = useMutation<Team>('/api/team');
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const handleLogin = async (fields: TeamFields) => {
    const payload: Omit<Team, '_id'> = {
      name: fields.name.trim(),
      description: fields.description?.trim(),
      members: []
    };

    const result = await post(payload);

    if (result) {
      navigate('/teams');
    }
  };

  useEffect(() => {
    if (error) {
      api.error({
        message: error
      });
    }
  }, [error]);

  return (
    <>
      {contextHolder}
      <h2>Team</h2>
      <Form
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleLogin}
        autoComplete="off"
        disabled={loading}
      >
        <Form.Item<TeamFields>
          label="Name"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input autoFocus />
        </Form.Item>

        <Form.Item<TeamFields> label="Description" name="description">
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 3, span: 12 }}>
          <div>
            <Button
              type="primary"
              htmlType="submit"
              disabled={loading}
              loading={loading}
            >
              Submit
            </Button>
            <Link to="/teams" className={styles.close}>
              <Button>Close</Button>
            </Link>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default TeamPage;
