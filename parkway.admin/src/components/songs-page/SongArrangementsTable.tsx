import { SongArrangement } from '../../types';
import { Button, Form, Input, InputRef, Modal, Table } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import styles from './SongArrangementsTable.module.css';
import { BasicDeleteButton } from '../delete-button';
import { BaseFormFooter } from '../base-data-table-page';
import UserProfileSelect from '../user-profile-select';
import { trimStrings } from '../../utilities';
import { UserNameDisplay } from '../user-name-display';
import { EditOutlined } from '@ant-design/icons';

interface SongArrangementsTableProps {
  songArrangements: SongArrangement[] | undefined;
  onUpdate: (songArrangements: SongArrangement[]) => void;
}

type SongArrangementModalItem = SongArrangement & {
  isEditing: boolean;
};

const SongArrangementsTable = ({
  songArrangements,
  onUpdate
}: SongArrangementsTableProps) => {
  const [data, setData] = useState<SongArrangement[]>(songArrangements ?? []);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const arrangementNameRef = useRef<InputRef>(null);
  const [modalForm] = Form.useForm<SongArrangementModalItem>();
  const vocalist = Form.useWatch('vocalist', modalForm);

  useEffect(() => {
    onUpdate(data);
  }, [data]);

  useEffect(() => {
    if (arrangementNameRef.current?.input) {
      arrangementNameRef.current.input.focus();
    }
  }, [isModalOpen]);

  const handleAdd = () => {
    modalForm.setFieldsValue({
      arrangementName: '',
      arrangementDescription: '',
      key: '',
      vocalist: undefined
    });

    setIsModalOpen(true);
  };

  const handleModalSave = (input: SongArrangementModalItem) => {
    const values = trimStrings(input);

    if (!values.isEditing) {
      const existingName = data.find(
        (item) =>
          item.arrangementName.toLowerCase() ===
          values.arrangementName.toLowerCase()
      );

      if (existingName) {
        modalForm.setFields([
          {
            name: 'arrangementName',
            errors: ['Name is already in use!']
          }
        ]);

        return;
      }

      const { isEditing, ...newArrangement } = values;

      setData((prev) => [...prev, newArrangement]);
      setIsModalOpen(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleVocalistChange = (value: string | undefined) => {
    modalForm.setFieldsValue({
      vocalist: value
    });
  };

  const handleDelete = useCallback((name: string) => {
    setData((prev) => prev.filter((item) => item.arrangementName !== name));
  }, []);

  const handleEdit = useCallback(
    (name: string) => {
      const item = data.find((item) => item.arrangementName === name);

      if (item) {
        modalForm.setFieldsValue(item);
        setIsModalOpen(true);
      }
    },
    [data]
  );

  const columns: OrderedColumnsType<SongArrangement> = useMemo(
    () => [
      {
        title: 'Actions',
        dataIndex: 'arrangementName',
        key: 'actions',
        displayOrder: 0,
        width: 100,
        align: 'center',
        render: (value: SongArrangement['arrangementName']) => (
          <div className={styles.actionsColumn}>
            <Button onClick={() => handleEdit(value)} size="small">
              <EditOutlined />
            </Button>
            <BasicDeleteButton
              onDelete={() => handleDelete(value)}
              isIconButton
            />
          </div>
        )
      },
      {
        title: 'Vocalist',
        dataIndex: 'vocalist',
        key: 'vocalist',
        displayOrder: 1,
        render: (value: SongArrangement['vocalist']) => (
          <UserNameDisplay user={value} />
        )
      },
      {
        title: 'Key',
        dataIndex: 'key',
        key: 'key',
        displayOrder: 2
      },
      {
        title: 'Name',
        dataIndex: 'arrangementName',
        key: 'arrangementName',
        displayOrder: 3
      },
      {
        title: 'Description',
        dataIndex: 'arrangementDescription',
        key: 'arrangementDescription',
        displayOrder: 4
      }
    ],
    [handleDelete]
  );

  return (
    <div className={styles.container}>
      <Button type="primary" className={styles.addButton} onClick={handleAdd}>
        Add
      </Button>
      <Modal
        title="Song Arrangement"
        open={isModalOpen}
        onOk={() => {}}
        onCancel={handleModalCancel}
        footer={() => <></>}
      >
        <Form<SongArrangementModalItem>
          form={modalForm}
          name="Song Arrangement"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          onFinish={handleModalSave}
          autoComplete="off"
        >
          <Form.Item<SongArrangementModalItem>
            label="Name"
            name="arrangementName"
            rules={[{ required: true, whitespace: true, message: 'Required' }]}
          >
            <Input ref={arrangementNameRef} autoComplete="off" />
          </Form.Item>

          <Form.Item<SongArrangementModalItem>
            label="Description"
            name="arrangementDescription"
          >
            <Input />
          </Form.Item>

          <Form.Item<SongArrangementModalItem>
            label="Key"
            name="key"
            rules={[{ required: true, whitespace: true, message: 'Required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<SongArrangementModalItem> label="Vocalist" name="vocalist">
            <UserProfileSelect
              onChange={handleVocalistChange}
              initialValue={vocalist}
            />
          </Form.Item>

          <BaseFormFooter
            isDisabled={false}
            isLoading={false}
            onCancel={handleModalCancel}
          />
        </Form>
      </Modal>
      <Table
        dataSource={data}
        columns={columns}
        rowKey={(record: SongArrangement) => record.arrangementName}
        size="small"
        bordered
        scroll={{ x: 'auto' }}
      />
    </div>
  );
};

export default SongArrangementsTable;
