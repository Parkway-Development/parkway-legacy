import { Button, Form, Input, notification } from 'antd';
import { Team } from '../../types/Team.ts';
import styles from './TeamPage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import useApi from '../../hooks/useApi.ts';

interface TeamFields {
  name: string;
  description: string;
  leaderId: string;
  members: string[];
}

const TeamPage = () => {
  const { createTeam, formatError } = useApi();
  const { isPending, mutate } = useMutation({ mutationFn: createTeam });
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const handleLogin = (fields: TeamFields) => {
    const payload: Omit<Team, '_id'> = {
      name: fields.name.trim(),
      description: fields.description?.trim(),
      members: []
    };

    mutate(payload, {
      onSuccess: () => navigate('/teams'),
      onError: (error) =>
        api.error({
          message: formatError(error)
        })
    });
  };

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
        disabled={isPending}
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
              disabled={isPending}
              loading={isPending}
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
