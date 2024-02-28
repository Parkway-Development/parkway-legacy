import { useMutation } from '../../hooks/useAxios.ts';
import { Button, notification } from 'antd';
import { useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';

interface DeleteButtonProps {
  url: string;
  onSuccess?: () => void;
}

const DeleteButton = ({ url, onSuccess }: DeleteButtonProps) => {
  const { loading, error, deleteCall } = useMutation(url);
  const [api, contextHolder] = notification.useNotification();

  const handleClick = async () => {
    const result = await deleteCall();

    if (result && onSuccess) {
      onSuccess();
    }
  };

  useEffect(() => {
    if (error) {
      api.error({
        message: error
      });
    }
  }, [error]);

  return (
    <>
      {contextHolder}
      <Button type="primary" danger onClick={handleClick} disabled={loading}>
        <CloseOutlined spin={loading} />
      </Button>
    </>
  );
};

export default DeleteButton;
