import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const MessageModal = (props) => {
    return (
        <Modal isOpen={props.modal} toggle={props.toggle} className={props.className}>
            {!!props.title && <ModalHeader toggle={props.toggle}>{props.title}</ModalHeader>}
            <ModalBody>
                {props.message}
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={props.action1 || props.toggle}>{props.button1 || 'OK'}</Button>
            </ModalFooter>
      </Modal>
    );
};

export default MessageModal