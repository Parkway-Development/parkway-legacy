import { SongArrangement } from '../../types';
import { Button, Table } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import styles from './SongArrangementsTable.module.css';
import { BasicDeleteButton } from '../delete-button';

type SongArrangementsTableProps = {
  songArrangements: SongArrangement[] | undefined;
  onUpdate: (songArrangements: SongArrangement[]) => void;
};

const SongArrangementsTable = ({
  songArrangements,
  onUpdate
}: SongArrangementsTableProps) => {
  const [data, setData] = useState<SongArrangement[]>(songArrangements ?? []);

  useEffect(() => {
    onUpdate(data);
  }, [data]);

  const handleAdd = () => {
    setData((prev) => [
      ...prev,
      { arrangementName: `Arrangement name ${prev.length + 1}`, key: 'C' }
    ]);
  };

  const handleDelete = useCallback((name: string) => {
    setData((prev) => prev.filter((item) => item.arrangementName !== name));
  }, []);

  const columns: OrderedColumnsType<SongArrangement> = useMemo(
    () => [
      {
        title: 'Actions',
        dataIndex: 'arrangementName',
        key: 'actions',
        displayOrder: 0,
        width: 24,
        align: 'center',
        render: (value: SongArrangement['arrangementName']) => (
          <BasicDeleteButton onDelete={() => handleDelete(value)} />
        )
      },
      {
        title: 'Vocalist',
        dataIndex: 'vocalist',
        key: 'vocalist',
        displayOrder: 1
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
