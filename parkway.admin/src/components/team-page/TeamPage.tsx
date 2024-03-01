import { Breadcrumb, Button, Form, Input, notification } from 'antd';
import { Team } from '../../types/Team.ts';
import styles from './TeamPage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import useApi from '../../hooks/useApi.ts';
import UserProfileSelect from '../user-profile-select/UserProfileSelect.tsx';

interface TeamFields {
  name: string;
  description?: string;
  leaderId?: string;
  members: string[];
}

const TeamPage = () => {
  const { createTeam, formatError } = useApi();
  const { isPending, mutate } = useMutation({ mutationFn: createTeam });
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [form] = Form.useForm<TeamFields>();
  const leaderId = Form.useWatch('leaderId', form);

  const handleLogin = (fields: TeamFields) => {
    const payload: Omit<Team, '_id'> = {
      name: fields.name.trim(),
      description: fields.description?.trim(),
      leaderId: fields.leaderId,
      members: fields.members ?? []
    };

    mutate(payload, {
      onSuccess: () => navigate('/teams'),
      onError: (error) =>
        api.error({
          message: formatError(error)
        })
    });
  };

  const handleLeaderIdChange = (value: string | undefined) =>
    form.setFieldsValue({
      leaderId: value
    });

  const handleMembersChange = (value: string[] | undefined) =>
    form.setFieldsValue({
      members: value
    });

  return (
    <>
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: <Link to="/teams">Teams</Link>
          },
          {
            title: 'Add Team'
          }
        ]}
      />
      <Form
        form={form}
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

        <Form.Item<TeamFields> label="Leader" name="leaderId">
          <UserProfileSelect onChange={handleLeaderIdChange} />
        </Form.Item>

        <Form.Item<TeamFields> label="Members" name="members">
          <UserProfileSelect
            isMultiSelect
            onChange={handleMembersChange}
            excludedUserId={leaderId}
          />
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
