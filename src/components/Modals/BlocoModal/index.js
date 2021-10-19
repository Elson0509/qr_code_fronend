import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const BlocoModal = (props) => {
    return (
        <Modal isOpen={props.modal} toggle={props.toggle} className={props.className}>
            <ModalHeader toggle={props.toggle}>Selecione o bloco</ModalHeader>
            <ModalBody>
                {props.blocos && props.blocos.map(el=>
                    <div key={el.id} className='text-center my-2'>
                    <button type="button" className="btn btn-outline-primary w-100" onClick={()=>props.action(el)}>
                        {el.name}
                    </button>
                    </div>
                )}
            </ModalBody>
      </Modal>
    );
};

export default BlocoModal;