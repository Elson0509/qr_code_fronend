import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ConfirmModal = (props) => {
    return (
        <Modal isOpen={props.modal} toggle={props.toggle} className={props.className}>
            {!!props.title && <ModalHeader toggle={props.toggle}>{props.title}</ModalHeader>}
            <ModalBody>
                {props.message}
                {props.children}
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={props.action2 || props.toggle}>{props.button2 || 'Cancelar'}</Button>
                <Button color="primary" onClick={props.action1}>{props.button1 || 'Confirmar'}</Button>
            </ModalFooter>
      </Modal>
    );
};

export default ConfirmModal;