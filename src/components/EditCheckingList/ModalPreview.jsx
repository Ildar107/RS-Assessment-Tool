import React from 'react';
import { Modal, Button } from 'antd';

const ModalPreview = ({ isShowPreview, closeModal, view }) => (
  <Modal
    title="Task preview"
    visible={isShowPreview}
    width="40vw"
    onOk={() => {
      closeModal();
    }}
    onCancel={() => {
      closeModal();
    }}
    footer={[
      <Button key="back" type="primary" onClick={closeModal}>
        Ok
      </Button>,
    ]}
  >
    {view}
  </Modal>
);

export default ModalPreview;
