import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const GenericModal = (props) => {
    return (
        <Modal isOpen={props.modal} toggle={props.toggle} className={props.className}>
            {!!props.title && <ModalHeader toggle={props.toggle}>{props.title}</ModalHeader>}
            <ModalBody>
                {props.children}
            </ModalBody>
      </Modal>
    );
};

export default GenericModal;