import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

const UnitModal = (props) => {
  return (
    <Modal isOpen={props.modal} className={props.className}>
      <ModalHeader>Selecione a unidade</ModalHeader>
      <ModalBody>
        {props.bloco.Units && props.bloco.Units.map(el =>
          <div key={el.id} className='text-center my-2'>
            <button type="button" className="btn btn-outline-primary w-100" onClick={() => props.action(el)}>
              {el.number}
            </button>
          </div>
        )}
        {props.text && <p className='text-center' style={{ fontWeight: 200 }}>{props.text}</p>}
      </ModalBody>
    </Modal>
  );
};

export default UnitModal;