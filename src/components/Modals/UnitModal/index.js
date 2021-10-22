import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const UnitModal = (props) => {
    return (
        <Modal isOpen={props.modal} className={props.className}>
            <ModalHeader>Selecione a unidade</ModalHeader>
            <ModalBody>
                {props.bloco.Units && props.bloco.Units.map(el=>
                    <div key={el.id} className='text-center my-2'>
                        <button type="button" className="btn btn-outline-primary w-100" onClick={()=>props.action(el)}>
                            {el.number}
                        </button>
                    </div>
                )}
            </ModalBody>
      </Modal>
    );
};

export default UnitModal;