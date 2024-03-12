import { DatePicker, Form, Input, Radio, Select, Switch } from 'antd';
import {
  applicationRoleMapping,
  memberStatusMapping,
  UserProfile
} from '../../types';
import {
  buildSelectOptionsFromMapping,
  transformDateForDatePicker,
  trimStrings
} from '../../utilities';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';

export type UserProfileFormFields = Omit<
  UserProfile,
  '_id' | 'teams' | 'family'
>;

type UserProfileFormProps = AddBaseApiFormProps<UserProfile> & {
  initialValues?: UserProfileFormFields;
  submitText?: string;
  cancelText?: string;
  isMyProfile?: boolean;
};

const FormItem = Form.Item<UserProfileFormFields>;

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
  onSave,
  onCancel,
  submitText = 'Submit',
  cancelText = 'Cancel',
  isMyProfile = false
}: UserProfileFormProps) => {
  const [form] = Form.useForm<UserProfileFormFields>();

  const initial = initialValues
    ? {
        ...initialValues,
        dateOfBirth: transformDateForDatePicker(initialValues.dateOfBirth)
      }
    : addProfileInitialValues;

  const handleSubmit = (values: UserProfileFormFields) => {
    let payload = trimStrings(values);

    if (isMyProfile) {
      payload = {
        ...payload,
        user: initial.user,
        member: initial.member,
        memberStatus: initial.memberStatus,
        applicationRole: initial.applicationRole
      };
    }

    const finalPayload = payload as Omit<UserProfile, '_id'>;
    onSave(finalPayload);
  };

  return (
    <>
      <Form<UserProfileFormFields>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSubmit}
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

        <BaseFormFooter
          isDisabled={isSaving}
          isLoading={isSaving}
          onCancel={onCancel}
          submitText={submitText}
          cancelText={cancelText}
        />
      </Form>
    </>
  );
};

export default UserProfileForm;
