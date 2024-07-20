import { Breadcrumb, Button, Form, Input, Table } from 'antd';
import { Link } from 'react-router-dom';
import { BaseFormFooter } from '../base-data-table-page';
import UserProfileSelect from '../user-profile-select';
import MoneyDisplay from '../money-display';
import DatePicker from '../date-picker';
import { IndividualContributionPayload } from '../../api';
import { getDateString } from '../../utilities';
import { useState } from 'react';
import styles from './AddContributionForm.module.css';
import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';

type AddContributionFormValues = {
  transactionDate: string;
  depositId?: string;
  contributions: IndividualContributionPayload[];
};

const emptyContribution: IndividualContributionPayload = {
  gross: 0,
  fees: 0,
  net: 0,
  accounts: [],
  transactionDate: '',
  type: 'cash',
  notes: [],
  responsiblePartyProfileId: ''
};

const AddContributionForm = () => {
  const [form] = Form.useForm<AddContributionFormValues>();
  const [initialValues] = useState<AddContributionFormValues>(() => ({
    transactionDate: getDateString(new Date())!,
    contributions: [{ ...emptyContribution }]
  }));

  const handleProfileChange = (value: string | undefined, index: number) => {
    const contributions = form.getFieldValue('contributions') || [];

    if (contributions[index]) {
      contributions[index]['contributorProfileId'] = value;
      form.setFieldsValue({ contributions });
    }
  };

  const handleMoneyChange = (index: number) => {
    const contributions = form.getFieldValue('contributions') || [];

    if (contributions[index]) {
      const gross = contributions[index]['gross'];
      const fees = contributions[index]['fees'];
      const net = gross - fees;
      console.log('net', net);

      if (!isNaN(net)) {
        contributions[index]['net'] = net;
        console.log('setting net', contributions);
        form.setFieldsValue({ contributions: [...contributions] });
      }
    }
  };

  const handleSave = (values: AddContributionFormValues) => {
    console.log('values', values);
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/accounts">Accounts</Link>
          },
          {
            title: <Link to="/accounts/contributions">Contributions</Link>
          },
          {
            title: 'Add Contribution'
          }
        ]}
      />
      <Form<AddContributionFormValues>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSave}
        autoComplete="off"
        disabled={false}
        initialValues={initialValues}
      >
        <Form.Item<AddContributionFormValues>
          label="Transaction Date"
          name="transactionDate"
          rules={[{ required: true, message: 'Transaction date is required.' }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item<AddContributionFormValues>
          label="Deposit Id"
          name="depositId"
        >
          <Input />
        </Form.Item>

        <Form.List name="contributions">
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
          {(fields, { add, remove }) => (
            <>
              <Table
                className={styles.table}
                size="small"
                dataSource={fields}
                pagination={false}
                rowKey="key"
                columns={[
                  {
                    title: 'Contributor',
                    dataIndex: 'contributorProfileId',
                    key: 'contributorProfileId',
                    render: (_, field, index) => (
                      <Form.Item name={[field.name, 'contributorProfileId']}>
                        <UserProfileSelect
                          onChange={(value: string | undefined) =>
                            handleProfileChange(value, index)
                          }
                        />
                      </Form.Item>
                    )
                  },
                  {
                    title: 'Gross Amount',
                    dataIndex: 'gross',
                    key: 'gross',
                    align: 'center',
                    width: 120,
                    render: (_, field, index) => (
                      <Form.Item
                        name={[field.name, 'gross']}
                        rules={[
                          {
                            required: true,
                            message: 'Gross amount is required.'
                          }
                        ]}
                        wrapperCol={{ span: 24 }}
                      >
                        <Input
                          type="number"
                          style={{ textAlign: 'right' }}
                          onChange={() => handleMoneyChange(index)}
                        />
                      </Form.Item>
                    )
                  },
                  {
                    title: 'Fees',
                    dataIndex: 'fees',
                    key: 'fees',
                    align: 'center',
                    width: 120,
                    render: (_, field, index) => (
                      <Form.Item
                        name={[field.name, 'fees']}
                        rules={[
                          { required: true, message: 'Fee amount is required.' }
                        ]}
                        wrapperCol={{ span: 24 }}
                      >
                        <Input
                          type="number"
                          style={{ textAlign: 'right' }}
                          onChange={() => handleMoneyChange(index)}
                        />
                      </Form.Item>
                    )
                  },
                  {
                    title: 'Net Amount',
                    dataIndex: 'net',
                    align: 'center',
                    key: 'net',
                    width: 120,
                    render: (_, field, index) => {
                      const netAmount = form.getFieldValue([
                        'contributions',
                        field.name,
                        'net'
                      ]);
                      return (
                        <Form.Item
                          name={[field.name, 'net']}
                          wrapperCol={{ span: 24 }}
                          shouldUpdate={(
                            prevValues: AddContributionFormValues,
                            curValues: AddContributionFormValues
                          ) =>
                            prevValues.contributions?.[index]?.gross !==
                            curValues.contributions?.[index]?.gross
                          }
                        >
                          <span>
                            {!isNaN(netAmount) ? (
                              <MoneyDisplay pennies={netAmount} />
                            ) : (
                              '$0.00'
                            )}
                          </span>
                        </Form.Item>
                      );
                    }
                  },
                  {
                    title: 'Type',
                    dataIndex: 'type',
                    key: 'type',
                    render: (_, field) => (
                      <Form.Item
                        name={[field.name, 'type']}
                        rules={[
                          { required: true, message: 'Type is required.' }
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    )
                  },
                  {
                    title: 'Accounts',
                    dataIndex: 'accounts',
                    key: 'accounts',
                    render: (_, field) => (
                      <Form.Item name={[field.name, 'accounts']}>
                        <Input />
                      </Form.Item>
                    )
                  },
                  {
                    title: 'Remove',
                    key: 'remove',
                    render: (_, __, index) => (
                      <Button
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                      >
                        <CloseOutlined />
                      </Button>
                    )
                  }
                ]}
              />{' '}
              <Button onClick={() => add({ ...emptyContribution })}>
                <PlusCircleOutlined />
              </Button>
            </>
          )}
        </Form.List>

        <BaseFormFooter
          isDisabled={false}
          isLoading={false}
          onCancel={() => {}}
        />
      </Form>
    </>
  );
};

export default AddContributionForm;
