import { Breadcrumb, Button, Form, Input } from 'antd';
import styles from './TeamForm.module.css';
import { Link } from 'react-router-dom';
import UserProfileSelect from '../user-profile-select/UserProfileSelect.tsx';
import { Team } from '../../types/Team.ts';
import { AddBaseApiFormProps } from '../base-data-table-page';

type TeamWithoutId = Omit<Team, '_id'>;

type TeamFormProps = AddBaseApiFormProps<Team> & {
  initialValues?: TeamWithoutId;
};

const TeamForm = ({
  isSaving,
  initialValues,
  onSave,
  onCancel
}: TeamFormProps) => {
  const [form] = Form.useForm<TeamWithoutId>();
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
      <Form<TeamWithoutId>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={onSave}
        autoComplete="off"
        disabled={isSaving}
        initialValues={initialValues}
      >
        <Form.Item<TeamWithoutId>
          label="Name"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input autoFocus />
        </Form.Item>

        <Form.Item<TeamWithoutId> label="Description" name="description">
          <Input />
        </Form.Item>

        <Form.Item<TeamWithoutId> label="Leader" name="leader">
          <UserProfileSelect
            onChange={handleLeaderChange}
            initialValue={initialValues?.leader}
          />
        </Form.Item>

        <Form.Item<TeamWithoutId> label="Members" name="members">
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
            <Button className={styles.close} onClick={onCancel}>
              Close
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default TeamForm;
