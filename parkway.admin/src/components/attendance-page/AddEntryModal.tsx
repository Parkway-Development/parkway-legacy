import { Alert, Button, Form, InputNumber, Modal } from 'antd';
import { useState } from 'react';
import { BaseFormFooter } from '../base-data-table-page';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './AddEntryModal.module.scss';
import DatePickerExtended from '../date-picker-extended';
import dayjs from 'dayjs';
import TextArea from 'antd/lib/input/TextArea';
import { AddEntryPayload } from '../../api';

interface AddEntryModalProps {
  attendanceId: string;
}

interface AddEntryModalFormFields {
  date: Date;
  count: number;
  notes?: string;
}

const AddEntryModal = ({ attendanceId }: AddEntryModalProps) => {
  const {
    attendanceApi: { addEntry },
    formatError
  } = useApi();
  const { mutate, isPending, error } = useMutation({
    mutationFn: addEntry
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalForm] = Form.useForm<AddEntryModalFormFields>();
  const queryClient = useQueryClient();

  const handleModalSave = (values: AddEntryModalFormFields) => {
    const payload: AddEntryPayload = {
      attendanceId,
      ...values
    };

    mutate(payload, {
      onSuccess: () => {
        modalForm.resetFields();
        setIsModalOpen(false);
        queryClient.invalidateQueries({
          queryKey: buildQueryKey('attendanceEntry', attendanceId)
        });
      }
    });
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={handleModalOpen} type="primary">
        Add Entry
      </Button>
      <Modal
        title="Add Entry"
        open={isModalOpen}
        onOk={() => {}}
        onCancel={handleModalCancel}
        footer={() => <></>}
      >
        {error && <Alert message={formatError(error)} type="error" />}
        <Form<AddEntryModalFormFields>
          form={modalForm}
          name="User Registration"
          onFinish={handleModalSave}
          autoComplete="off"
          className={styles.form}
          initialValues={{
            date: dayjs().startOf('day'),
            count: 0,
            notes: undefined
          }}
        >
          <Form.Item<AddEntryModalFormFields>
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Required' }]}
          >
            <DatePickerExtended />
          </Form.Item>
          <Form.Item<AddEntryModalFormFields>
            label="Count"
            name="count"
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber min={0} step={1} precision={0} />
          </Form.Item>
          <Form.Item<AddEntryModalFormFields> label="Notes" name="notes">
            <TextArea />
          </Form.Item>
          <BaseFormFooter
            isDisabled={isPending}
            isLoading={isPending}
            onCancel={handleModalCancel}
          />
        </Form>
      </Modal>
    </>
  );
};

export default AddEntryModal;
