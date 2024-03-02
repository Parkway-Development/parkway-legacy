import {
  Breadcrumb,
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Switch
} from 'antd';
import styles from './UserProfileForm.module.css';
import { Link } from 'react-router-dom';
import {
  applicationRoleOptions,
  statusOptions,
  UserProfile
} from '../../types/UserProfile.ts';
import dayjs from 'dayjs';

export type UserProfileFormFields = Omit<
  UserProfile,
  '_id' | 'teams' | 'family'
>;

type TeamFormProps = {
  isSaving: boolean;
  initialValues?: UserProfileFormFields;
  onFinish: (values: UserProfileFormFields) => void;
};

const FormItem = Form.Item<UserProfileFormFields>;

export const transformFieldsToPayload = (
  fields: UserProfileFormFields
): Omit<UserProfile, '_id'> => ({
  firstname: fields.firstname.trim(),
  lastname: fields.lastname.trim(),
  middleinitial: fields.middleinitial?.trim(),
  nickname: fields.nickname?.trim(),
  dateofbirth: fields.dateofbirth,
  gender: fields.gender,
  email: fields.email?.trim(),
  mobile: fields.mobile?.trim(),
  streetaddress1: fields.streetaddress1?.trim(),
  streetaddress2: fields.streetaddress2?.trim(),
  city: fields.city?.trim(),
  state: fields.state?.trim(),
  zip: fields.zip?.trim(),
  userId: fields.userId,
  member: fields.member,
  status: fields.status,
  applicationrole: fields.applicationrole
});

const addProfileInitialValues: UserProfileFormFields = {
  firstname: '',
  lastname: '',
  applicationrole: 'none',
  status: 'active',
  member: false
};

const UserProfileForm = ({
  isSaving,
  initialValues,
  onFinish
}: TeamFormProps) => {
  const [form] = Form.useForm<UserProfileFormFields>();

  const initial = initialValues
    ? {
        ...initialValues,
        dateofbirth: initialValues.dateofbirth
          ? dayjs(initialValues.dateofbirth, 'YYYY-MM-DD')
          : undefined
      }
    : addProfileInitialValues;

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/directory">Directory</Link>
          },
          {
            title: initialValues ? 'Edit Profile' : 'Add Profile'
          }
        ]}
      />
      <Form<UserProfileFormFields>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 7 }}
        onFinish={onFinish}
        disabled={isSaving}
        initialValues={initial}
      >
        <FormItem
          label="First Name"
          name="firstname"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input autoFocus />
        </FormItem>
        <FormItem label="Middle Initial" name="middleinitial">
          <Input />
        </FormItem>
        <FormItem label="Nickname" name="nickname">
          <Input />
        </FormItem>
        <FormItem
          label="Last Name"
          name="lastname"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input />
        </FormItem>

        <FormItem label="Date of Birth" name="dateofbirth">
          <DatePicker />
        </FormItem>

        <FormItem label="Gender" name="gender">
          <Radio.Group>
            <Radio.Button value="male">Male</Radio.Button>
            <Radio.Button value="female">Female</Radio.Button>
          </Radio.Group>
        </FormItem>

        <FormItem
          label="Email"
          name="email"
          rules={[{ type: 'email', message: 'Invalid email' }]}
        >
          <Input />
        </FormItem>

        <FormItem label="Mobile Number" name="mobile">
          <Input />
        </FormItem>

        <FormItem label="Street Address Line 1" name="streetaddress1">
          <Input />
        </FormItem>

        <FormItem label="Street Address Line 2" name="streetaddress2">
          <Input />
        </FormItem>

        <FormItem label="City" name="city">
          <Input />
        </FormItem>

        <FormItem label="State" name="state">
          <Input />
        </FormItem>

        <FormItem label="Zip" name="zip">
          <Input />
        </FormItem>

        <FormItem label="Member" name="member">
          <Switch />
        </FormItem>

        <FormItem label="Status" name="status">
          <Radio.Group>
            {statusOptions?.map(({ value, label }) => (
              <Radio.Button value={value} key={value}>
                {label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </FormItem>

        <FormItem label="Application Role" name="applicationrole">
          <Select options={applicationRoleOptions} />
        </FormItem>

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
            <Link to="/directory" className={styles.close}>
              <Button>Close</Button>
            </Link>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default UserProfileForm;
