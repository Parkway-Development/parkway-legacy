import { Alert, Button, Form, InputNumber, Modal } from 'antd';
import { useState } from 'react';
import { BaseFormFooter } from '../base-data-table-page';
import useApi, { buildQueryKey, TypedResponse } from '../../hooks/useApi.tsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './AddEntryModal.module.scss';
import dayjs from 'dayjs';
import TextArea from 'antd/lib/input/TextArea';
import { AttendanceEntry } from '../../types/AttendanceEntry.ts';
import DatePicker from '../date-picker';
import { getDateString } from '../../utilities';
import { parseISO } from 'date-fns';

interface AddEntryModalProps {
  attendanceId: string;
}

interface AddEntryModalFormFields {
  date: string;
  count: number;
  notes?: string;
}

type BaseModalFormProps<T> = {
  title: string;
  isModalOpen: boolean;
  onClose: () => void;
  mutationFn: (payload: T) => TypedResponse<AttendanceEntry>;
  attendanceId: string;
  initialValues?: Omit<AttendanceEntry, 'date'> & { date: string };
};

const BaseModalForm = <T,>({
  title,
  isModalOpen,
  onClose,
  mutationFn,
  attendanceId,
  initialValues
}: BaseModalFormProps<T>) => {
  const { formatError } = useApi();
  const queryClient = useQueryClient();
  const [modalForm] = Form.useForm<AddEntryModalFormFields>();
  const { mutate, isPending, error } = useMutation({
    mutationFn
  });

  const handleModalSave = (values: AddEntryModalFormFields) => {
    const payload = {
      _id: initialValues?._id,
      attendanceId,
      ...values,
      date: parseISO(values.date)
    } as T;

    mutate(payload, {
      onSuccess: () => {
        modalForm.resetFields();
        onClose();
        queryClient.invalidateQueries({
          queryKey: buildQueryKey('attendanceEntry', attendanceId)
        });
      }
    });
  };

  return (
    <Modal
      title={title}
      open={isModalOpen}
      onOk={() => {}}
      onCancel={onClose}
      footer={() => <></>}
    >
      {error && <Alert message={formatError(error)} type="error" />}
      <Form<AddEntryModalFormFields>
        form={modalForm}
        name={title}
        onFinish={handleModalSave}
        autoComplete="off"
        className={styles.form}
        initialValues={
          initialValues ?? {
            date: dayjs().startOf('day'),
            count: 0,
            notes: undefined
          }
        }
      >
        <Form.Item<AddEntryModalFormFields>
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Required' }]}
        >
          <DatePicker />
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
          onCancel={onClose}
        />
      </Form>
    </Modal>
  );
};

const AddEntryModal = ({ attendanceId }: AddEntryModalProps) => {
  const {
    attendanceApi: { addEntry }
  } = useApi();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleOnClose = () => setIsModalOpen(false);

  return (
    <>
      <Button onClick={handleModalOpen} type="primary">
        Add Entry
      </Button>
      <BaseModalForm
        title="Add Entry"
        isModalOpen={isModalOpen}
        onClose={handleOnClose}
        attendanceId={attendanceId}
        mutationFn={addEntry}
      />
    </>
  );
};

type EditEntryModalProps = {
  attendanceEntry: AttendanceEntry | undefined;
  onClose: () => void;
};

export const EditEntryModal = ({
  attendanceEntry,
  onClose
}: EditEntryModalProps) => {
  const {
    attendanceApi: { updateEntry }
  } = useApi();

  if (!attendanceEntry) return null;

  const initialValues = {
    ...attendanceEntry,
    date: getDateString(attendanceEntry.date)!
  };

  return (
    <>
      <BaseModalForm
        title="Edit Entry"
        isModalOpen
        onClose={onClose}
        attendanceId={attendanceEntry.attendance}
        mutationFn={updateEntry}
        initialValues={initialValues}
      />
    </>
  );
};

export default AddEntryModal;
