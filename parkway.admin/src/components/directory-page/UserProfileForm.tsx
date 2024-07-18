import { Breadcrumb, Form, Input, Radio, Switch } from 'antd';
import { UserProfile } from '../../types';
import { getDateString, isDateString, trimStrings } from '../../utilities';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';
import { Link } from 'react-router-dom';
import DatePicker from '../date-picker';
import { parseISO } from 'date-fns';

export type UserProfileFormFields = Omit<
  UserProfile,
  '_id' | 'teams' | 'family'
> & {
  dateOfBirth?: string | Date;
};

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
        dateOfBirth: getDateString(initialValues.dateOfBirth)
      }
    : addProfileInitialValues;

  const handleSubmit = (values: UserProfileFormFields) => {
    let payload = trimStrings(values);

    payload.dateOfBirth = isDateString(payload.dateOfBirth)
      ? parseISO(payload.dateOfBirth as string)
      : undefined;

    form.setFields([
      {
        name: ['address', 'streetAddress1'],
        errors: []
      },
      {
        name: ['address', 'city'],
        errors: []
      },
      {
        name: ['address', 'state'],
        errors: []
      },
      {
        name: ['address', 'zip'],
        errors: []
      }
    ]);

    let address = payload.address;

    if (address) {
      const streetAddress1Valid = address.streetAddress1?.length > 0;
      const cityValid = address.city?.length > 0;
      const stateValid = address.state?.length > 0;
      const zipValid =
        address.zip?.length > 0 &&
        address.zip?.match(/^\d{5}(-\d{4})?$/) !== null;

      const anyValid =
        streetAddress1Valid || cityValid || stateValid || zipValid;
      const allValid =
        streetAddress1Valid && cityValid && stateValid && zipValid;

      if (!anyValid) {
        address = null;
      } else if (anyValid && !allValid) {
        if (!streetAddress1Valid) {
          form.setFields([
            {
              name: ['address', 'streetAddress1'],
              errors: ['Required']
            }
          ]);
        }
        if (!cityValid) {
          form.setFields([
            {
              name: ['address', 'city'],
              errors: ['Required']
            }
          ]);
        }
        if (!stateValid) {
          form.setFields([
            {
              name: ['address', 'state'],
              errors: ['Required']
            }
          ]);
        }
        if (!zipValid) {
          form.setFields([
            {
              name: ['address', 'zip'],
              errors: ['Invalid zip']
            }
          ]);
        }

        return;
      }
    }

    if (isMyProfile) {
      payload = {
        ...payload,
        user: initial.user,
        member: initial.member,
        address
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

        <FormItem
          label="Street Address Line 1"
          name={['address', 'streetAddress1']}
        >
          <Input />
        </FormItem>

        <FormItem
          label="Street Address Line 2"
          name={['address', 'streetAddress2']}
        >
          <Input />
        </FormItem>

        <FormItem label="City" name={['address', 'city']}>
          <Input />
        </FormItem>

        <FormItem label="State" name={['address', 'state']}>
          <Input />
        </FormItem>

        <FormItem label="Zip" name={['address', 'zip']}>
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
