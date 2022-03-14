import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { PREFIX_IMG_GOOGLE_CLOUD } from '../../../services/constants'
import classes from './ImageModal.module.css'

const ImageModal = (props) => {
    return (
        <Modal isOpen={props.modal} toggle={props.toggle} className='text-center'>
            <ModalHeader toggle={props.toggle}>Imagem</ModalHeader>
            <ModalBody>
                <img
                    src={PREFIX_IMG_GOOGLE_CLOUD + props.id}
                    alt='user'
                    loading='lazy'
                    className={classes.Img}
                />
            </ModalBody>
            <ModalBody>
                <button type="button" onClick={props.toggle} className="btn btn-danger">Fechar</button>
            </ModalBody>
        </Modal>
    );
};

export default ImageModal;