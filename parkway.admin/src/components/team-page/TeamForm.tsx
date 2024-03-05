import { Breadcrumb, Button, Form, Input } from 'antd';
import styles from './TeamForm.module.css';
import { Link } from 'react-router-dom';
import UserProfileSelect from '../user-profile-select/UserProfileSelect.tsx';
import { Team } from '../../types/Team.ts';

export type TeamFormFields = Omit<Team, '_id'>;

type TeamFormProps = {
  isSaving: boolean;
  initialValues?: TeamFormFields;
  onFinish: (values: TeamFormFields) => void;
};

const TeamForm = ({ isSaving, initialValues, onFinish }: TeamFormProps) => {
  const [form] = Form.useForm<TeamFormFields>();
  const leader = Form.useWatch('leader', form);

  const handleLeaderChange = (value: string | undefined) =>
    form.setFieldsValue({
      leader: value
    });

  const handleMembersChange = (value: string[] | undefined) =>
    form.setFieldsValue({
      members: value
    });

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/teams">Teams</Link>
          },
          {
            title: initialValues ? 'Edit Team' : 'Add Team'
          }
        ]}
      />
      <Form<TeamFormFields>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={onFinish}
        autoComplete="off"
        disabled={isSaving}
        initialValues={initialValues}
      >
        <Form.Item<TeamFormFields>
          label="Name"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input autoFocus />
        </Form.Item>

        <Form.Item<TeamFormFields> label="Description" name="description">
          <Input />
        </Form.Item>

        <Form.Item<TeamFormFields> label="Leader" name="leader">
          <UserProfileSelect
            onChange={handleLeaderChange}
            initialValue={initialValues?.leader}
          />
        </Form.Item>

        <Form.Item<TeamFormFields> label="Members" name="members">
          <UserProfileSelect
            isMultiSelect
            onChange={handleMembersChange}
            excludedUserId={leader}
            initialValue={initialValues?.members}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 3, span: 12 }}>
          <div>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isSaving}
              loading={isSaving}
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

export default TeamForm;
