import { Button, notification, Popconfirm } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import useApi, { GenericResponse } from '../../hooks/useApi.ts';
import { useMutation } from '@tanstack/react-query';

interface DeleteButtonProps {
  id: string;
  deleteFn: (id: string) => GenericResponse;
  onSuccess?: () => void;
  isIconButton?: boolean;
}

const DeleteButton = ({
  id,
  deleteFn,
  onSuccess,
  isIconButton = true
}: DeleteButtonProps) => {
  const { formatError } = useApi();
  const { mutate, isPending } = useMutation({ mutationFn: deleteFn });
  const [api, contextHolder] = notification.useNotification();

  const handleClick = () => {
    mutate(id, {
      onSuccess: () => {
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: (error) => {
        api.error({
          message: formatError(error)
        });
      }
    });
  };

  return (
    <>
      {contextHolder}
      <BasicDeleteButton
        onDelete={handleClick}
        isLoading={isPending}
        isIconButton={isIconButton}
      />
    </>
  );
};

type BasicDeleteButtonProps = {
  onDelete: () => void;
  isLoading?: boolean;
  isIconButton: boolean;
};

export const BasicDeleteButton = ({
  onDelete,
  isLoading = false,
  isIconButton
}: BasicDeleteButtonProps) => {
  return (
    <>
      <Popconfirm
        title="Delete"
        description="Are you sure to delete this?"
        onConfirm={onDelete}
        onCancel={() => {}}
        disabled={isLoading}
        okText="Yes"
        cancelText="No"
      >
        <Button
          type={isIconButton ? 'primary' : 'default'}
          danger
          disabled={isLoading}
          size={isIconButton ? 'small' : undefined}
        >
          {isIconButton ? <CloseOutlined spin={isLoading} /> : 'Delete'}
        </Button>
      </Popconfirm>
    </>
  );
};

export default DeleteButton;
