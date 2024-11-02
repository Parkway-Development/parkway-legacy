import { Breadcrumb, ColorPicker, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { EventCategory } from '../../types';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';
import styles from './EventCategoryForm.module.css';
import EventCategoryDisplay from '../event-category-display';
import { ColorPickerProps } from 'antd/es/color-picker/interface';

type EventCategoryWithoutId = Omit<EventCategory, '_id'>;

type EventCategoryFormProps = AddBaseApiFormProps<EventCategory> & {
  initialValues?: EventCategoryWithoutId;
};

const EventCategoryForm = ({
  isSaving,
  initialValues: initialValuesProp,
  onSave,
  onCancel
}: EventCategoryFormProps) => {
  const [form] = Form.useForm<EventCategoryWithoutId>();
  const backgroundColorString = Form.useWatch('backgroundColor', form);
  const fontColorString = Form.useWatch('fontColor', form);
  const nameValue = Form.useWatch('name', form);

  const initialValues = initialValuesProp
    ? initialValuesProp
    : {
        backgroundColor: '#E6F4FF',
        fontColor: '#000000'
      };

  const handleBackgroundColorChange: ColorPickerProps['onChange'] = (value) => {
    form.setFieldsValue({
      backgroundColor: value.toHexString()
    });
  };

  const handleFontColorChange: ColorPickerProps['onChange'] = (value) => {
    form.setFieldsValue({
      fontColor: value.toHexString()
    });
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/events">Events</Link>
          },
          {
            title: <Link to="/events/categories">Categories</Link>
          },
          {
            title: initialValues ? 'Edit Category' : 'Add Category'
          }
        ]}
      />
      <Form<EventCategoryWithoutId>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={onSave}
        autoComplete="off"
        disabled={isSaving}
        initialValues={initialValues}
      >
        <Form.Item<EventCategoryWithoutId>
          label="Name"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input autoFocus autoComplete="off" />
        </Form.Item>

        <div className={styles.previewContainer}>
          <span className={styles.label}>Preview:</span>
          <EventCategoryDisplay
            eventCategory={{
              name: nameValue,
              backgroundColor: backgroundColorString,
              fontColor: fontColorString
            }}
          />
        </div>

        <Form.Item<EventCategoryWithoutId>
          label="Background Color"
          name="backgroundColor"
        >
          <ColorPicker
            defaultValue={initialValues?.backgroundColor}
            onChange={handleBackgroundColorChange}
          />
        </Form.Item>

        <Form.Item<EventCategoryWithoutId> label="Font Color" name="fontColor">
          <ColorPicker
            defaultValue={initialValues?.fontColor}
            onChange={handleFontColorChange}
          />
        </Form.Item>

        <BaseFormFooter
          isDisabled={isSaving}
          isLoading={isSaving}
          onCancel={onCancel}
        />
      </Form>
    </>
  );
};

export default EventCategoryForm;
