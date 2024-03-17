import { Button, Form } from 'antd';
import styles from './BaseFormFooter.module.css';
import { ReactNode } from 'react';

export type BaseFormFooterType = {
  isDisabled: boolean;
  isLoading: boolean;
  onCancel: () => void;
  submitText?: string;
  cancelText?: string;
  children?: ReactNode;
};

export const BaseFormFooter = ({
  isDisabled,
  isLoading,
  onCancel,
  submitText = 'Submit',
  cancelText = 'Close',
  children
}: BaseFormFooterType) => {
  return (
    <Form.Item wrapperCol={{ offset: 3, span: 12 }}>
      <div className={styles.container}>
        <Button
          type="primary"
          htmlType="submit"
          disabled={isDisabled}
          loading={isLoading}
        >
          {submitText}
        </Button>
        <Button disabled={isDisabled} onClick={onCancel}>
          {cancelText}
        </Button>
        {children}
      </div>
    </Form.Item>
  );
};
