import React, { useState } from 'react';
import { validateEmail } from '../../../services/util'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
import api from '../../../services/api';

const ForgetPasswordModal = (props) => {
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [buttonDisable, setButtonDisable] = useState(false)
    const [spinner, setSpinner] = useState(false)
    const [email, setEmail] = useState('')

    const submitHandler = ev => {
        ev.preventDefault()
        if (!validateEmail(email))
            return setErrorMessage('Email não válido')
        setSpinner(true)
        setErrorMessage('')
        api.post('user/forgotpass', {email})
            .then(res => {
                setSpinner(false)
                setButtonDisable(true)
                setSuccessMessage(res.data.message)
            })
            .catch(err => {
                setSpinner(false)
                setErrorMessage(err.response?.data?.message || 'Um erro ocorreu.')
            })
    }

    return (
        <Modal isOpen={props.modal} toggle={props.toggle} className={props.className}>
            {!!props.title && <ModalHeader toggle={props.toggle}>{props.title}</ModalHeader>}
            <ModalBody>
                {!successMessage &&
                    <div className="form-group">
                        <label>Digite seu email para resetar a senha:</label>
                        <input type="email"
                            name="email"
                            className="form-control"
                            aria-describedby="emailHelp"
                            onChange={ev => setEmail(ev.target.value)}
                            value={email}
                        />
                        {errorMessage && <div className="alert alert-danger p-0 text-center my-2" role="alert">
                            {errorMessage}
                        </div>}
                    </div>}
                {successMessage &&
                    <div className="alert alert-success p-0 text-center my-2" role="alert">
                        {successMessage}
                    </div>}
            </ModalBody>
                {
                    spinner ?
                    <ModalFooter style={{margin: '0 auto'}}>
                        <Spinner color="primary"/>
                    </ModalFooter>
                    :
                    <ModalFooter>
                        <Button color="primary" onClick={submitHandler} disabled={buttonDisable}>Confirmar</Button>
                        <Button color="secondary" onClick={props.toggle} disabled={buttonDisable}>Cancelar</Button>
                    </ModalFooter>
                }
            
        </Modal>
    );
};

export default ForgetPasswordModal;