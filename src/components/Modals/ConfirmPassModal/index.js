import React, {useState, Fragment} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import FormInput from '../../Form/FormInput'
import api from '../../../services/api';
import { Spinner } from 'reactstrap';
import { testStrongPassword } from '../../../services/util'

const ConfirmModal = (props) => {
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const confirmHandler = _ => {
        if(!testStrongPassword (password)){
            return setErrorMessage(`Senha incorreta.`)
        }
        setLoading(true)
        api.post(`user/confirmpass`,{password})
        .then(res=>{
            setLoading(false)
            setErrorMessage('')
            props.action()
        })
        .catch((err)=>{
            setLoading(false)
            setErrorMessage(err.response?.data?.message || 'Senha inválida.')
        })
    }

    return (
        <Modal isOpen={props.modal} toggle={props.toggle} className={props.className}>
            <ModalHeader toggle={props.toggle}>Confirmação de senha</ModalHeader>
            {
                loading ? (
                    <div className='text-center p-4'>
                        <Spinner color="primary"/>
                    </div> )
                :
                (<Fragment>
                    <ModalBody>
                        <FormInput
                            label='Confirme a operação com sua senha.'
                            type='password'
                            value={password}
                            changeValue={setPassword}
                        />
                        {
                            errorMessage && <div className="alert alert-danger text-center mt-2 p-1" role="alert">
                                {errorMessage}
                            </div>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={props.toggle}>{'Cancelar'}</Button>
                        <Button color="primary" onClick={()=>confirmHandler()}>{'Confirmar'}</Button>
                    </ModalFooter>
                </Fragment>)
            }
      </Modal>
    );
};

export default ConfirmModal;