import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import QRCode from 'qrcode.react'
import * as Constants from '../../../services/constants'

const QRCodeModal = (props) => {
    return (
        <Modal isOpen={props.modal} toggle={props.toggle} className='text-center'>
            <ModalHeader toggle={props.toggle}>QR Code</ModalHeader>
            <ModalBody>
                <QRCode value={`${Constants.QR_CODE_PREFIX}${props.id}`} includeMargin={true} style={{width: '80%', height: 'auto', maxWidth: 500}}/>
            </ModalBody>
      </Modal>
    );
};

export default QRCodeModal;