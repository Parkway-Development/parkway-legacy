import { Alert, Button, Checkbox, Form, Modal } from 'antd';
import { RegistrationSlot } from '../../types';
import { useCallback, useRef, useState } from 'react';
import { BaseFormFooter } from '../base-data-table-page';
import UserProfileSelect from '../user-profile-select';
import { RegisterForEventPayload } from '../../api';
import useApi, { buildQueryKey } from '../../hooks/useApi.tsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './RegisterUserModal.module.scss';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

interface RegisterUserModalProps {
  slots: RegistrationSlot[];
  eventId: string;
}

interface EventRegistrationFormFields {
  profile: string;
  slots: string[];
}

const RegisterUserModal = ({ slots, eventId }: RegisterUserModalProps) => {
  const {
    eventsApi: { register },
    formatError
  } = useApi();
  const { mutate, isPending, error } = useMutation({
    mutationFn: register
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalForm] = Form.useForm<EventRegistrationFormFields>();
  const checkedSlots = useRef<string[]>([]);
  const queryClient = useQueryClient();

  const handleModalSave = (values: EventRegistrationFormFields) => {
    const payload: RegisterForEventPayload = {
      profile: values.profile,
      eventId,
      slots: slots.length === 1 ? [slots[0].slotId] : values.slots
    };

    mutate(payload, {
      onSuccess: () => {
        modalForm.resetFields();
        setIsModalOpen(false);
        queryClient.invalidateQueries({
          queryKey: buildQueryKey('eventRegistrations')
        });
      }
    });
  };

  const handleModalOpen = () => {
    checkedSlots.current = [];
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleProfileChange = (value: string | undefined) =>
    modalForm.setFieldsValue({
      profile: value
    });

  const handleSlotCheckEvent = useCallback(
    (e: CheckboxChangeEvent) => {
      if (e.target.checked) {
        checkedSlots.current.push(e.target.value);
      } else {
        checkedSlots.current = checkedSlots.current.filter(
          (s) => s !== e.target.value
        );
      }

      modalForm.setFieldsValue({
        slots: checkedSlots.current
      });
    },
    [modalForm]
  );

  return (
    <>
      <Button onClick={handleModalOpen} type="primary">
        Register User
      </Button>
      <Modal
        title="Register User"
        open={isModalOpen}
        onOk={() => {}}
        onCancel={handleModalCancel}
        footer={() => <></>}
      >
        {error && <Alert message={formatError(error)} type="error" />}
        <Form<EventRegistrationFormFields>
          form={modalForm}
          name="User Registration"
          onFinish={handleModalSave}
          autoComplete="off"
          className={styles.form}
        >
          <Form.Item<EventRegistrationFormFields>
            label="User"
            name="profile"
            rules={[{ required: true, message: 'Required' }]}
          >
            <UserProfileSelect onChange={handleProfileChange} />
          </Form.Item>

          {slots.length > 1 && (
            <Form.Item<EventRegistrationFormFields>
              label="Slots"
              name="slots"
              rules={[
                { required: true, message: 'Required' },
                {
                  min: 1,
                  type: 'array',
                  message: 'At least one slot is required'
                }
              ]}
            >
              {slots.map((slot) => (
                <div key={slot.slotId}>
                  <Checkbox
                    id={slot.slotId}
                    value={slot.slotId}
                    onChange={handleSlotCheckEvent}
                  />
                  <label htmlFor={slot.slotId} className={styles.slotLabel}>
                    {slot.name}
                  </label>
                </div>
              ))}
            </Form.Item>
          )}

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

export default RegisterUserModal;
