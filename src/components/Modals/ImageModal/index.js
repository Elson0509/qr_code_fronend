import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Image from '../../Image';

const ImageModal = (props) => { 
    return (
        <Modal isOpen={props.modal} toggle={props.toggle} className='text-center'>
            <ModalHeader toggle={props.toggle}>QR Code</ModalHeader>
            <ModalBody>
               <Image id={props.id} height={450}/>
            </ModalBody>
            <ModalBody>
                <button type="button" onClick={props.toggle} className="btn btn-danger">Fechar</button>
            </ModalBody>
      </Modal>
    );
};

export default ImageModal;