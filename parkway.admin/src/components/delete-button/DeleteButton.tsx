import { Button, notification } from 'antd';
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
      <Button type="primary" danger onClick={handleClick} disabled={isPending}>
        <CloseOutlined spin={isPending} />
      </Button>
    </>
  );
};

export default DeleteButton;
