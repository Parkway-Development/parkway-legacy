import { BaseEntity } from '../../types';
import * as React from 'react';
import { CSSProperties, useEffect, useState } from 'react';
import { Button, ModalFuncProps, Switch } from 'antd';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvidedDraggableProps
} from '@hello-pangea/dnd';
import { DragOutlined } from '@ant-design/icons';

interface ColumnConfigurationModal<T extends BaseEntity> {
  columns: React.MutableRefObject<OrderedColumnsType<T>>;
}

const ColumnConfigurationModal = <T extends BaseEntity>({
  columns: columnsProp
}: ColumnConfigurationModal<T>) => {
  const [columns, setColumns] = useState<OrderedColumnsType<T>>(
    columnsProp.current
  );

  useEffect(() => {
    columnsProp.current = columns;
  }, [columns, columnsProp]);

  const handleSwitchToggle = (key: string) => (toggled: boolean) => {
    setColumns((prev) =>
      prev.map((c) => (c.key === key ? { ...c, hidden: !toggled } : c))
    );
  };

  const reorder = (
    list: OrderedColumnsType<T>,
    startIndex: number,
    endIndex: number
  ) => {
    const [removed] = list.splice(startIndex, 1);
    list.splice(endIndex, 0, removed);

    return list;
  };

  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggableProvidedDraggableProps['style']
  ): CSSProperties => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    margin: `0 0 .5em 0`,
    display: 'flex',
    gap: '1em',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '.25em .5em',

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'unset',

    // styles we need to apply on draggables
    ...draggableStyle
  });

  const getListStyle = (isDraggingOver: boolean) => ({
    border: isDraggingOver ? '1px dashed darkblue' : 'unset',
    padding: '.5em'
  });

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      columns,
      result.source.index + 1,
      result.destination.index + 1
    );

    setColumns(
      items.map((c, index) => ({
        ...c,
        displayOrder: index
      }))
    );
  };

  const handleShowHideClick = (show: boolean) => () => {
    setColumns((prev) =>
      prev.map((c) => (c.key === '__actions' ? c : { ...c, hidden: !show }))
    );
  };

  return (
    <div>
      <div>
        <Button onClick={handleShowHideClick(true)}>Show All</Button>
        <Button onClick={handleShowHideClick(false)}>Hide All</Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {columns
                .filter(({ key }) => key !== '__actions')
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map(({ title, hidden, key }, index) => (
                  <Draggable
                    key={key}
                    draggableId={key.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <DragOutlined />
                        <Switch
                          checked={hidden === undefined || !hidden}
                          onClick={handleSwitchToggle(key)}
                        />
                        <span>{title?.toString()}</span>
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export const modalProps: ModalFuncProps = {
  title: 'Column Configuration',
  icon: null,
  style: { top: '2em' },
  okCancel: true
};

export default ColumnConfigurationModal;
