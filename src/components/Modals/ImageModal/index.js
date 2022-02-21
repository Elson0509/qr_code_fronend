import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Image from '../../Image';
import ImageCloud from '../../ImageCloud';

const ImageModal = (props) => { 
    return (
        <Modal isOpen={props.modal} toggle={props.toggle} className='text-center'>
            <ModalHeader toggle={props.toggle}>QR Code</ModalHeader>
            <ModalBody>
               <ImageCloud id={props.id} height={450}/>
            </ModalBody>
            <ModalBody>
                <button type="button" onClick={props.toggle} className="btn btn-danger">Fechar</button>
            </ModalBody>
      </Modal>
    );
};

export default ImageModal;