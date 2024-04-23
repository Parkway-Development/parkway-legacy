import { Breadcrumb, DatePicker, Form, Input, Radio, Switch } from 'antd';
import { UserProfile } from '../../types';
import { transformDateToDayjs, trimStrings } from '../../utilities';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';
import { Link } from 'react-router-dom';

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
        dateOfBirth: transformDateToDayjs(initialValues.dateOfBirth)
      }
    : addProfileInitialValues;

  const handleSubmit = (values: UserProfileFormFields) => {
    let payload = trimStrings(values);

    if (isMyProfile) {
      payload = {
        ...payload,
        user: initial.user,
        member: initial.member
      };
    }

    const finalPayload = payload as Omit<UserProfile, '_id'>;
    onSave(finalPayload);
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/profiles">Directory</Link>
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
          <FormItem label="Member" name="member">
            <Switch />
          </FormItem>
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
