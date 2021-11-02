import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import QRCode from 'qrcode.react'
import * as Constants from '../../../services/constants'

const QRCodeModal = (props) => {
    const downloadQR = _ => {
        const canvas = document.getElementById("qr-code-generated")
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream")
        const downloadLink = document.createElement("a")
        downloadLink.href = pngUrl;
        downloadLink.download = `${props.info}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    return (
        <Modal isOpen={props.modal} toggle={props.toggle} className='text-center'>
            <ModalHeader toggle={props.toggle}>QR Code</ModalHeader>
            <ModalBody>
                <QRCode id='qr-code-generated' value={`${Constants.QR_CODE_PREFIX}${props.id}`} includeMargin={true} style={{width: '80%', height: 'auto', maxWidth: 500}}/>
                
            </ModalBody>
            {props.info && <ModalBody>
                <button type="button" onClick={downloadQR}  className="btn btn-info">Download QR Code</button>
            </ModalBody>}
      </Modal>
    );
};

export default QRCodeModal;