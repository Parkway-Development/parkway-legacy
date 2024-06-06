import { RegistrationSlot } from '../../types';
import { useEffect, useRef, useState } from 'react';
import styles from './RegistrationSlotInput.module.scss';
import DateDisplay from '../date-display';
import BooleanDisplay from '../boolean-display/BooleanDisplay.tsx';
import { Alert, Button, Checkbox, DatePicker, Form, Input, Modal } from 'antd';
import { BaseFormFooter } from '../base-data-table-page';
import { Dayjs } from 'dayjs';
import TimeSelect, {
  getTimeSelectHours,
  getTimeSelectMinutes,
  getTimeSelectValue,
  isEndTimeAfterStart
} from '../time-select';
import { isSameDate, transformDateToDayjs } from '../../utilities';
import { EditOutlined } from '@ant-design/icons';

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
  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(false);
  const slotsRef = useRef<RegistrationSlot[]>(initialValue);
  const [editSlot, setEditSlot] = useState<RegistrationSlot>();
  const [registrationSlots, setRegistrationSlots] =
    useState<RegistrationSlot[]>(initialValue);

  useEffect(() => {
    if (slotsRef.current !== registrationSlots) {
      onChange(registrationSlots, true);
      slotsRef.current = registrationSlots;
    }
  }, [onChange, registrationSlots]);

  const handleSave = (registrationSlot: RegistrationSlot, isNew: boolean) => {
    if (isNew) {
      setRegistrationSlots((prev) => [...prev, registrationSlot]);
    } else {
      setRegistrationSlots((prev) =>
        prev.map((p) =>
          p.slotId === registrationSlot.slotId ? registrationSlot : p
        )
      );
    }

    setHasPendingChanges(true);
  };

  const rows = registrationSlots
    .filter((slot) => !slot.deleted)
    .map((input) => {
      return (
        <tr key={input.slotId}>
          <td>
            <Button
              size="small"
              type="text"
              onClick={() => {
                const registrationInput = {
                  ...input,
                  startDate: transformDateToDayjs(input.start),
                  startTime: getTimeSelectValue(new Date(input.start)),
                  endDate: transformDateToDayjs(input.end),
                  endTime: getTimeSelectValue(new Date(input.end))
                };

                setEditSlot(registrationInput);
              }}
            >
              <EditOutlined />
            </Button>
          </td>
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
      <AddEditModal
        onSave={handleSave}
        registrationSlot={editSlot}
        defaultValues={{
          slotId: '',
          name: '',
          description: '',
          available: true,
          ...eventDates
        }}
      />
      {rows.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>Name</th>
              <th className={styles.dateColumn}>Start</th>
              <th className={styles.dateColumn}>End</th>
              <th className={styles.openColumn}>Open</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      ) : (
        <span>
          A general registration slot will be created automatically if no slots
          are added.
        </span>
      )}
      {hasPendingChanges && (
        <Alert
          message="Changes are not persisted until you click Submit"
          type="warning"
        />
      )}
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
  registrationSlot: RegistrationSlotFormFields | undefined;
  defaultValues: RegistrationSlotFormFields;
  onSave: (registrationSlot: RegistrationSlot, isNew: boolean) => void;
};

const AddEditModal = ({
  onSave,
  registrationSlot,
  defaultValues
}: AddModalProps) => {
  const slotId = useRef<string>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalForm] = Form.useForm<RegistrationSlotFormFields>();
  const available = Form.useWatch('available', modalForm);

  useEffect(() => {
    if (registrationSlot?.slotId) {
      modalForm.setFieldsValue(registrationSlot);
      slotId.current = registrationSlot.slotId;
      setIsModalOpen(true);
    } else if (defaultValues) {
      modalForm.setFieldsValue(defaultValues);
    }
  }, [modalForm, registrationSlot, defaultValues]);

  const handleModalSave = (values: RegistrationSlotFormFields) => {
    const { startDate, startTime, endDate, endTime, ...remaining } = values;

    remaining.slotId = slotId.current ?? crypto.randomUUID();

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

    onSave(finalValues, slotId.current === undefined);
    modalForm.setFieldsValue(defaultValues);
    slotId.current = undefined;
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    modalForm.setFieldsValue(defaultValues);
    slotId.current = undefined;
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
