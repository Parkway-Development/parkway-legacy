import { RegistrationSlot } from '../../types';
import { useEffect, useRef, useState } from 'react';
import styles from './RegistrationSlotInput.module.css';
import DateDisplay from '../date-display';
import BooleanDisplay from '../boolean-display/BooleanDisplay.tsx';
import { Button, Checkbox, DatePicker, Form, Input, Modal } from 'antd';
import { BaseFormFooter } from '../base-data-table-page';
import { Dayjs } from 'dayjs';
import TimeSelect, {
  getTimeSelectHours,
  getTimeSelectMinutes,
  isEndTimeAfterStart
} from '../time-select';
import { isSameDate } from '../../utilities';

interface RegistrationSlotInputProps {
  onChange: (registrationSlots: RegistrationSlot[], isValid: boolean) => void;
  initialValue: RegistrationSlot[];
  eventDates: {
    startDate?: Dayjs;
    startTime?: string;
    endDate?: Dayjs;
    endTime?: string;
  };
}

const RegistrationSlotInput = ({
  onChange,
  initialValue,
  eventDates
}: RegistrationSlotInputProps) => {
  const slotsRef = useRef<RegistrationSlot[]>(initialValue);
  const [registrationSlots, setRegistrationSlots] =
    useState<RegistrationSlot[]>(initialValue);

  useEffect(() => {
    if (slotsRef.current !== registrationSlots) {
      onChange(registrationSlots, true);
      slotsRef.current = registrationSlots;
    }
  }, [onChange, registrationSlots]);

  const handleAdd = (registrationSlot: RegistrationSlot) => {
    setRegistrationSlots((prev) => [...prev, registrationSlot]);
  };

  const rows = registrationSlots
    .filter((slot) => !slot.deleted)
    .map((input) => {
      return (
        <tr key={input.slotId}>
          <td>{input.name}</td>
          <td>
            <DateDisplay date={input.start} displayTime />
          </td>
          <td>
            <DateDisplay date={input.end} displayTime />
          </td>
          <td>
            <BooleanDisplay value={input.available} />
          </td>
        </tr>
      );
    });

  return (
    <div className={styles.container}>
      <AddModal
        onAdd={handleAdd}
        registrationSlot={{
          slotId: '',
          name: '',
          description: '',
          available: true,
          ...eventDates
        }}
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th className={styles.dateColumn}>Start</th>
            <th className={styles.dateColumn}>End</th>
            <th className={styles.openColumn}>Open</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

type RegistrationSlotFormFields = Omit<RegistrationSlot, 'start' | 'end'> & {
  startDate?: Dayjs;
  startTime?: string;
  endDate?: Dayjs;
  endTime?: string;
};

type AddModalProps = {
  registrationSlot: RegistrationSlotFormFields;
  onAdd: (registrationSlot: RegistrationSlot) => void;
};

const AddModal = ({ onAdd, registrationSlot }: AddModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalForm] = Form.useForm<RegistrationSlotFormFields>();
  const available = Form.useWatch('available', modalForm);

  const initialValues: Omit<RegistrationSlotFormFields, 'slotId'> = {
    ...registrationSlot
  };

  const handleModalSave = (values: RegistrationSlotFormFields) => {
    const { startDate, startTime, endDate, endTime, ...remaining } = values;

    if (registrationSlot.slotId === '') {
      remaining.slotId = crypto.randomUUID();
    }
    const start = startDate!.toDate();
    const end = endDate!.toDate();

    start.setHours(getTimeSelectHours(startTime!));
    start.setMinutes(getTimeSelectMinutes(startTime!));
    start.setSeconds(0);

    end.setHours(getTimeSelectHours(endTime!));
    end.setMinutes(getTimeSelectMinutes(endTime!));
    end.setSeconds(0);

    const finalValues: RegistrationSlot = {
      ...remaining,
      start,
      end
    };

    onAdd(finalValues);
    modalForm.resetFields();
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const validateEndDate = (_: unknown, value: Dayjs) => {
    const startDate: Dayjs = modalForm.getFieldValue('startDate');
    if (value && startDate && value.isBefore(startDate, 'day')) {
      return Promise.reject('End date cannot be before the start date');
    }

    return Promise.resolve();
  };

  const validateEndTime = (_: unknown, value: string) => {
    const startDate: Dayjs = modalForm.getFieldValue('startDate');
    const startTime: string = modalForm.getFieldValue('startTime');
    const endDate: Dayjs = modalForm.getFieldValue('endDate');

    if (
      startDate &&
      endDate &&
      startTime &&
      value &&
      isSameDate(startDate.toDate(), endDate.toDate()) &&
      !isEndTimeAfterStart(startTime, value)
    ) {
      return Promise.reject('End time cannot be after the start time');
    }

    return Promise.resolve();
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Add Slot</Button>
      <Modal
        title="Registration Slot"
        open={isModalOpen}
        onOk={() => {}}
        onCancel={handleModalCancel}
        footer={() => <></>}
      >
        <Form<RegistrationSlotFormFields>
          form={modalForm}
          name="Song Arrangement"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          onFinish={handleModalSave}
          autoComplete="off"
          initialValues={initialValues}
        >
          <Form.Item<RegistrationSlotFormFields>
            label="Name"
            name="name"
            rules={[{ required: true, whitespace: true, message: 'Required' }]}
          >
            <Input autoFocus autoComplete="off" />
          </Form.Item>

          <Form.Item<RegistrationSlotFormFields>
            label="Description"
            name="description"
          >
            <Input />
          </Form.Item>

          <Form.Item<RegistrationSlotFormFields>
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: 'Start date is required.' }]}
          >
            <DatePicker
              onChange={(value) => modalForm.setFieldsValue({ endDate: value })}
            />
          </Form.Item>

          <Form.Item<RegistrationSlotFormFields>
            label="Start Time"
            name="startTime"
            rules={[{ required: true, message: 'Start time is required.' }]}
          >
            <TimeSelect />
          </Form.Item>

          <Form.Item<RegistrationSlotFormFields>
            label="End Date"
            name="endDate"
            rules={[
              { required: true, message: 'End date is required.' },
              { validator: validateEndDate }
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item<RegistrationSlotFormFields>
            label="End Time"
            name="endTime"
            rules={[
              { required: true, message: 'End time is required.' },
              { validator: validateEndTime }
            ]}
          >
            <TimeSelect />
          </Form.Item>

          <Form.Item<RegistrationSlotFormFields>
            label="Is Open"
            name="available"
          >
            <Checkbox
              checked={available}
              onChange={(e) =>
                modalForm.setFieldsValue({ available: e.target.checked })
              }
            />
          </Form.Item>

          <BaseFormFooter
            isDisabled={false}
            isLoading={false}
            onCancel={handleModalCancel}
          />
        </Form>
      </Modal>
    </>
  );
};

export default RegistrationSlotInput;
