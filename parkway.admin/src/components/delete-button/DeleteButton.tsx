import { Button, notification } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { GenericResponse } from '../../hooks/useApi.ts';
import { useMutation } from '@tanstack/react-query';

interface DeleteButtonProps {
  id: string;
  deleteFn: (id: string) => GenericResponse;
  onSuccess?: () => void;
}

const DeleteButton = ({ id, deleteFn, onSuccess }: DeleteButtonProps) => {
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
        console.log(error);
        api.error({
          message: error?.message
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
