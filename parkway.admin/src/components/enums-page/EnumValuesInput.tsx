import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import styles from './EnumValuesInput.module.css';
import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';

interface EnumValuesInputProps {
  onChange: (values: string[]) => void;
  initialValue: string[] | undefined;
}

const EnumValuesInput = ({ onChange, initialValue }: EnumValuesInputProps) => {
  const [values, setValues] = useState<string[]>(() => {
    return initialValue ?? [''];
  });

  useEffect(() => {
    const changeValues = values.filter(
      (value) => (value?.trim()?.length ?? 0) > 0
    );

    onChange(changeValues);
  }, [values]);

  const handleValueChange = useCallback(
    (index: number, value: string | undefined) => {
      setValues((prev) =>
        prev.map((input, i) => (i === index ? value ?? '' : input))
      );
    },
    []
  );

  const handleAddRow = () => {
    setValues((prev) => [...prev, '']);
  };

  const handleDeleteRow = (rowIndex: number) => {
    setValues((prev) => prev.filter((_, index) => index !== rowIndex));
  };

  const rows = values.map((value, index) => {
    return (
      <div key={index} className={styles.accountRow}>
        <Input
          onChange={(e: SyntheticEvent<HTMLInputElement>) =>
            handleValueChange(index, e.currentTarget.value)
          }
          value={value}
        />
        <Button onClick={handleAddRow}>
          <PlusCircleOutlined />
        </Button>
        <Button
          onClick={() => handleDeleteRow(index)}
          disabled={values.length <= 1}
        >
          <CloseOutlined />
        </Button>
      </div>
    );
  });

  return (
    <div className={styles.container}>
      {rows}
      <div className={styles.footerLabel}>
        <span>Count of Values:</span>
        <span>{rows.length}</span>
      </div>
    </div>
  );
};

export default EnumValuesInput;
