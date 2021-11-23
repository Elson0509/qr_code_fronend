import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import FormInput from '../../Form/FormInput';
import ActionButtons from '../../Buttons/ActionButtons';

const ReplyModal = (props) => {
    const replyHandler = _ =>{
        props.replyHandler()
        props.toggle() 
    }

    return (
        <Modal isOpen={props.modal} toggle={props.toggle} className={props.className}>
            <ModalHeader toggle={props.toggle}>Enviar Mensagem</ModalHeader>
            <ModalBody>
                <FormInput
                    label='Assunto'
                    value={props.subject}
                    changeValue={props.setSubject}
                />
                <FormInput
                    label='Resposta'
                    value={props.reply}
                    changeValue={props.setReply}
                />
            </ModalBody>
            <ModalFooter>
                <ActionButtons
                    textButton1='Enviar'
                    textButton2='Cancelar'
                    action1={replyHandler}
                    action2={props.toggle}
                />
            </ModalFooter>
      </Modal>
    );
};

export default ReplyModal;