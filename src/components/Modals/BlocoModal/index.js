import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

const BlocoModal = (props) => {
    return (
        <Modal isOpen={props.modal} className={props.className}>
            <ModalHeader>Selecione o bloco</ModalHeader>
            <ModalBody>
                {props.blocos && props.blocos.map(el=>
                    <div key={el.id} className='text-center my-2'>
                    <button type="button" className="btn btn-outline-primary w-100" onClick={()=>props.action(el)}>
                        {el.name}
                    </button>
                    </div>
                )}
                {props.text && <p className='text-center' style={{fontWeight: 200}}>{props.text}</p>}
            </ModalBody>
      </Modal>
    );
};

export default BlocoModal;