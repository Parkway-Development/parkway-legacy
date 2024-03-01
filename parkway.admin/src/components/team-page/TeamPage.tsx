import {
  Alert,
  Breadcrumb,
  Button,
  Form,
  Input,
  notification,
  Spin
} from 'antd';
import { Team } from '../../types/Team.ts';
import styles from './TeamPage.module.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useApi from '../../hooks/useApi.ts';
import UserProfileSelect from '../user-profile-select/UserProfileSelect.tsx';

interface TeamFields {
  name: string;
  description?: string;
  leaderId?: string;
  members: string[];
}

const TeamPage = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const id = params.id;
  const { createTeam, getTeamById, formatError, updateTeam } = useApi();
  const { isPending: isUpdating, mutate: update } = useMutation({
    mutationFn: updateTeam
  });
  const { isPending: isCreating, mutate: create } = useMutation({
    mutationFn: createTeam
  });
  const {
    isPending: isLoading,
    data: response,
    error
  } = useQuery({
    enabled: id !== undefined,
    queryFn: getTeamById(id!),
    queryKey: ['team', { id }]
  });
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

    const options = {
      onSuccess: () => {
        navigate('/teams');
        if (id) {
          queryClient.invalidateQueries({
            queryKey: ['team', { id }]
          });
        }
      },
      onError: (error: Error | null) =>
        api.error({
          message: formatError(error)
        })
    };

    if (id) {
      update({ ...payload, _id: id }, options);
    } else {
      create(payload, options);
    }
  };

  const handleLeaderIdChange = (value: string | undefined) =>
    form.setFieldsValue({
      leaderId: value
    });

  const handleMembersChange = (value: string[] | undefined) =>
    form.setFieldsValue({
      members: value
    });

  const isPending = isCreating || isUpdating || (id !== undefined && isLoading);

  if (id) {
    if (error) {
      return <Alert type="error" message={formatError(error)} />;
    }

    if (isLoading) {
      return <Spin />;
    }
  }

  const initialValues: TeamFields =
    id && response?.data ? { ...response.data } : { name: '', members: [] };

  console.log('initial values', initialValues);

  return (
    <>
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: <Link to="/teams">Teams</Link>
          },
          {
            title: id ? 'Edit Team' : 'Add Team'
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
        initialValues={initialValues}
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
          <UserProfileSelect
            onChange={handleLeaderIdChange}
            initialValue={initialValues.leaderId}
          />
        </Form.Item>

        <Form.Item<TeamFields> label="Members" name="members">
          <UserProfileSelect
            isMultiSelect
            onChange={handleMembersChange}
            excludedUserId={leaderId}
            initialValue={initialValues.members}
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
