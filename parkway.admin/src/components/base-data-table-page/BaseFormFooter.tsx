import { Button, Form } from 'antd';
import styles from './BaseFormFooter.module.css';

export type BaseFormFooterType = {
  isDisabled: boolean;
  isLoading: boolean;
  onCancel: () => void;
  submitText?: string;
  cancelText?: string;
};

export const BaseFormFooter = ({
  isDisabled,
  isLoading,
  onCancel,
  submitText = 'Submit',
  cancelText = 'Close'
}: BaseFormFooterType) => {
  return (
    <Form.Item wrapperCol={{ offset: 3, span: 12 }}>
      <div>
        <Button
          type="primary"
          htmlType="submit"
          disabled={isDisabled}
          loading={isLoading}
        >
          {submitText}
        </Button>
        <Button
          className={styles.close}
          disabled={isDisabled}
          onClick={onCancel}
        >
          {cancelText}
        </Button>
      </div>
    </Form.Item>
  );
};
