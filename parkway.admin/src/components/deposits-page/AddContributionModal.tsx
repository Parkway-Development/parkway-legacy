import { Deposit } from '../../types';
import { Button, Modal } from 'antd';
import AddContributionForm from '../contributions-page/AddContributionForm.tsx';
import { useState } from 'react';

type AddContributionModalProps = {
  deposit: Deposit;
};

const AddContributionModal = ({ deposit }: AddContributionModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalCancel = () => setIsModalOpen(false);

  return (
    <>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Contribution
      </Button>

      <Modal
        width={900}
        centered
        title="Add Contribution"
        open={isModalOpen}
        onOk={() => {}}
        onCancel={handleModalCancel}
        footer={() => <></>}
      >
        <AddContributionForm
          isModalContext
          deposit={deposit}
          onCancel={handleModalCancel}
        />
      </Modal>
    </>
  );
};

export default AddContributionModal;
