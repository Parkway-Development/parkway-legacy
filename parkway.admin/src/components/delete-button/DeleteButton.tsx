import { Button, notification, Popconfirm } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import useApi, { GenericResponse } from '../../hooks/useApi.ts';
import { useMutation } from '@tanstack/react-query';

interface DeleteButtonProps {
  id: string;
  deleteFn: (id: string) => GenericResponse;
  onSuccess?: () => void;
}

const DeleteButton = ({ id, deleteFn, onSuccess }: DeleteButtonProps) => {
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
      <Popconfirm
        title="Delete"
        description="Are you sure to delete this?"
        onConfirm={handleClick}
        disabled={isPending}
        okText="Yes"
        cancelText="No"
      >
        <Button type="primary" danger disabled={isPending} size="small">
          <CloseOutlined spin={isPending} />
        </Button>
      </Popconfirm>
    </>
  );
};

export default DeleteButton;
