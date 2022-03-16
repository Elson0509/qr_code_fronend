import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import FormComment from '../../Form/FormComment'
import { validateEmail } from '../../../services/util'
import api from '../../../services/api'

const ModalEmail = (props) => {
  const [email, setEmail] = useState({ email: '', subject: '', message: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const submitHandler = _ => {
    if (!validateEmail(email.email))
      return setErrorMessage('Email não válido')
    if (!email.subject)
      return setErrorMessage('É preciso inserir um assunto.')
    if (!email.message)
      return setErrorMessage('É preciso inserir uma mensagem.')
    if (email.message.trim().length < 15)
      return setErrorMessage('Mensagem muito curta. Pelo menos 15 caracteres')
    api.post('/email', { email: email.email, subject: email.subject, message: email.message })
      .then(res => {
        setErrorMessage('')
        setSuccessMessage('Mensagem enviada com sucesso. Em breve entraremos em contato.')
        setEmail({ email: '', subject: '', message: '' })
      })
      .catch(err => {
        setErrorMessage(err.response?.data?.message || 'Um erro ocorreu.')
      })
  }

  return (
    <Modal isOpen={props.modalEmail} toggle={() => props.setModalEmail(false)}>
      <ModalHeader toggle={() => props.setModalEmail(false)}>Mensagem</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Seu email</label>
          <input
            type="email"
            className="form-control"
            aria-describedby="email"
            placeholder="seu@email.com"
            onChange={ev => setEmail({ ...email, email: ev.target.value })}
            value={email.email} />
        </div>
        <div className="form-group">
          <label>Assunto</label>
          <input
            type="text"
            className="form-control"
            aria-describedby="assunto"
            onChange={ev => setEmail({ ...email, subject: ev.target.value })}
            value={email.subject} />
        </div>
        <FormComment
          label='Mensagem'
          columns={5}
          value={email.message}
          max={1000}
          changeValue={val => setEmail({ ...email, message: val })}
        />
        {
          !!errorMessage && <div className="alert alert-danger text-center" role="alert">
            {errorMessage}
          </div>
        }
        {
          !!successMessage && <div className="alert alert-success text-center" role="alert">
            {successMessage}
          </div>
        }
        {
          !successMessage &&
          <div className="text-center">
            <button type="submit" onClick={submitHandler} className="btn btn-primary mt-4">Enviar</button>
          </div>
        }
      </ModalBody>
    </Modal>
  );
};

export default ModalEmail;