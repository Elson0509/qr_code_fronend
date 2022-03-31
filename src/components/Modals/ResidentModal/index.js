import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

const ResidentModal = (props) => {
  return (
    <Modal isOpen={props.modal} className={props.className}>
      <ModalHeader>Selecione quem está autorizando</ModalHeader>
      <ModalBody>
        {props.users && props.users.map(el =>
          <div key={el.id} className='text-center my-2'>
            <button type="button" className="btn btn-outline-primary w-100" onClick={() => props.action(el)}>
              {el.name}
            </button>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ResidentModal;