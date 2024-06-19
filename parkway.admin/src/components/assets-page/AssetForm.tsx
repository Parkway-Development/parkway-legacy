import { Breadcrumb, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { Asset } from '../../types';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';
import { getDateString, isDateString } from '../../utilities';
import DatePicker from '../date-picker';
import { parseISO } from 'date-fns';

type AssetWithoutId = Omit<Asset, '_id'> & {
  purchaseDate?: Date | string;
  inServiceDate: Date | string;
};
type AssetFields = Omit<AssetWithoutId, 'notes'> & {
  notes: string;
};

type AssetFormProps = AddBaseApiFormProps<Asset> & {
  initialValues?: AssetWithoutId;
};

const AssetForm = ({
  isSaving,
  initialValues: initialValuesProp,
  onSave,
  onCancel
}: AssetFormProps) => {
  const [form] = Form.useForm<AssetFields>();
  const initialValues = {
    ...initialValuesProp,
    purchaseDate: getDateString(initialValuesProp?.purchaseDate),
    inServiceDate: getDateString(initialValuesProp?.inServiceDate),
    notes: initialValuesProp?.notes?.length ? initialValuesProp.notes[0] : ''
  };

  const handleSave = (values: AssetFields) => {
    const payload: AssetWithoutId = {
      ...values,
      purchaseDate: isDateString(values.purchaseDate)
        ? parseISO(values.purchaseDate as string)
        : undefined,
      inServiceDate: isDateString(values.inServiceDate)
        ? parseISO(values.inServiceDate as string)
        : values.inServiceDate,
      notes: [values.notes]
    };

    onSave(payload);
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/accounts">Accounts</Link>
          },
          {
            title: <Link to="/accounts/assets">Assets</Link>
          },
          {
            title: initialValues ? 'Edit Asset' : 'Add Asset'
          }
        ]}
      />
      <Form<AssetFields>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSave}
        autoComplete="off"
        disabled={isSaving}
        initialValues={initialValues}
      >
        <Form.Item<AssetFields>
          label="Name"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input autoFocus />
        </Form.Item>

        <Form.Item<AssetFields> label="Description" name="description">
          <Input />
        </Form.Item>

        <Form.Item<AssetFields>
          label="Value"
          name="value"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input type="number" step={0.01} />
        </Form.Item>

        <Form.Item<AssetFields> label="Purchase Date" name="purchaseDate">
          <DatePicker />
        </Form.Item>

        <Form.Item<AssetFields>
          label="Depreciation Type"
          name="depreciationType"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<AssetFields>
          label="In Service Date"
          name="inServiceDate"
          rules={[{ required: true, message: 'Required' }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item<AssetFields>
          label="Useful Life in Days"
          name="usefulLifeInDays"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input type="number" step={1} />
        </Form.Item>

        <Form.Item<AssetFields> label="Asset Type" name="assetType">
          <Input />
        </Form.Item>

        <Form.Item<AssetFields> label="Asset Category" name="assetCategory">
          <Input />
        </Form.Item>

        <Form.Item<AssetFields> label="Asset Location" name="assetLocation">
          <Input />
        </Form.Item>

        <Form.Item<AssetFields> label="Asset Status" name="assetStatus">
          <Input />
        </Form.Item>

        <Form.Item<AssetFields> label="Asset Condition" name="assetCondition">
          <Input />
        </Form.Item>

        <Form.Item<AssetFields> label="Notes" name="notes">
          <Input.TextArea />
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

export default AssetForm;
