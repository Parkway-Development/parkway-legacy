import { Button, DatePicker, Form, Input, Radio, Select, Switch } from 'antd';
import styles from './UserProfileForm.module.css';
import {
  applicationRoleMapping,
  memberStatusMapping,
  UserProfile
} from '../../types/UserProfile.ts';
import dayjs from 'dayjs';
import { buildSelectOptionsFromMapping } from '../../utilities/mappingHelpers.ts';

export type UserProfileFormFields = Omit<
  UserProfile,
  '_id' | 'teams' | 'family'
>;

type UserProfileFormProps = {
  isSaving: boolean;
  initialValues?: UserProfileFormFields;
  onFinish: (values: UserProfileFormFields) => void;
  onCancel: () => void;
  submitText?: string;
  cancelText?: string;
  isMyProfile: boolean;
};

const FormItem = Form.Item<UserProfileFormFields>;

export const transformFieldsToMyProfilePayload = (
  fields: UserProfileFormFields
): Omit<
  UserProfile,
  '_id' | 'user' | 'member' | 'memberStatus' | 'applicationRole'
> => ({
  firstName: fields.firstName.trim(),
  lastName: fields.lastName.trim(),
  middleInitial: fields.middleInitial?.trim(),
  nickname: fields.nickname?.trim(),
  dateOfBirth: fields.dateOfBirth,
  gender: fields.gender,
  email: fields.email?.trim(),
  mobilePhone: fields.mobilePhone?.trim(),
  homePhone: fields.homePhone?.trim(),
  streetAddress1: fields.streetAddress1?.trim(),
  streetAddress2: fields.streetAddress2?.trim(),
  city: fields.city?.trim(),
  state: fields.state?.trim(),
  zip: fields.zip?.trim()
});

export const transformFieldsToPayload = (
  fields: UserProfileFormFields
): Omit<UserProfile, '_id'> => ({
  ...transformFieldsToMyProfilePayload(fields),
  user: fields.user,
  member: fields.member,
  memberStatus: fields.memberStatus,
  applicationRole: fields.applicationRole
});

export const addProfileInitialValues: UserProfileFormFields = {
  firstName: '',
  lastName: '',
  applicationRole: 'none',
  memberStatus: 'active',
  member: false
};

const UserProfileForm = ({
  isSaving,
  initialValues,
  onFinish,
  onCancel,
  submitText = 'Submit',
  cancelText = 'Cancel',
  isMyProfile
}: UserProfileFormProps) => {
  const [form] = Form.useForm<UserProfileFormFields>();

  const initial = initialValues
    ? {
        ...initialValues,
        dateOfBirth: initialValues.dateOfBirth
          ? dayjs(initialValues.dateOfBirth, 'YYYY-MM-DD')
          : undefined
      }
    : addProfileInitialValues;

  return (
    <>
      <Form<UserProfileFormFields>
        form={form}
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        disabled={isSaving}
        initialValues={initial}
      >
        <FormItem
          label="First Name"
          name="firstName"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input autoFocus />
        </FormItem>
        <FormItem label="Middle Initial" name="middleInitial">
          <Input />
        </FormItem>
        <FormItem label="Nickname" name="nickname">
          <Input />
        </FormItem>
        <FormItem
          label="Last Name"
          name="lastName"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input />
        </FormItem>

        <FormItem label="Date of Birth" name="dateOfBirth">
          <DatePicker />
        </FormItem>

        <FormItem label="Gender" name="gender">
          <Radio.Group>
            <Radio.Button value="male">Male</Radio.Button>
            <Radio.Button value="female">Female</Radio.Button>
          </Radio.Group>
        </FormItem>

        {!isMyProfile && (
          <FormItem
            label="Email"
            name="email"
            rules={[{ type: 'email', message: 'Invalid email' }]}
          >
            <Input />
          </FormItem>
        )}

        <FormItem label="Mobile Phone" name="mobilePhone">
          <Input />
        </FormItem>

        <FormItem label="Home Phone" name="homePhone">
          <Input />
        </FormItem>

        <FormItem label="Street Address Line 1" name="streetAddress1">
          <Input />
        </FormItem>

        <FormItem label="Street Address Line 2" name="streetAddress2">
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

        {!isMyProfile && (
          <>
            <FormItem label="Member" name="member">
              <Switch />
            </FormItem>

            <FormItem label="Member Status" name="memberStatus">
              <Radio.Group>
                {Object.entries(memberStatusMapping).map(([value, label]) => (
                  <Radio.Button value={value} key={value}>
                    {label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </FormItem>

            <FormItem label="Application Role" name="applicationRole">
              <Select
                options={buildSelectOptionsFromMapping(applicationRoleMapping)}
              />
            </FormItem>
          </>
        )}

        <Form.Item>
          <div className={styles.footer}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isSaving}
              loading={isSaving}
            >
              {submitText}
            </Button>
            <Button onClick={onCancel}>{cancelText}</Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default UserProfileForm;
