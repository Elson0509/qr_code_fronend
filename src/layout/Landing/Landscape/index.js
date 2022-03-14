import React, { useState } from 'react';
import classes from './Landscape.module.css'
import bg from '../../../Images/landscape.jpg'
import FormComment from '../../../components/Form/FormComment';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import api from '../../../services/api'
import * as Constants from '../../../services/constants'
import { toast } from 'react-toastify';
import { validateEmail } from '../../../services/util'

const Landscape = () => {
  const [modalEmail, setModalEmail] = useState(false)
  const [email, setEmail] = useState({ email: '', subject: '', message: '' })
  const [errorMessage, setErrorMessage] = useState('')

  const submitHandler = _ => {
    if (!validateEmail(email.email))
      return setErrorMessage('Email não válido')
    if (!email.subject)
      return setErrorMessage('É preciso inserir um assunto.')
    if (!email.message)
      return setErrorMessage('É preciso inserir uma mensagem.')
    if (email.message.trim().length < 15)
      return setErrorMessage('Mensagem muito curta. Pelo menos 15 caracteres')
    api.post('/email', {email: email.email, subject: email.subject, message: email.message})
    .then(res=> {
      setErrorMessage('')
      toast.info('Mensagem enviada com sucesso. Em breve entraremos em contato.', Constants.TOAST_CONFIG)
      setModalEmail(false)
      setEmail({ email: '', subject: '', message: '' })
    })
    .catch(err => {
      console.log(err)
      setErrorMessage(err.response?.data?.message || 'Um erro ocorreu.')
    })
  }

  return (
    <section className={classes.Landscape} style={{ background: `url(${bg}) no-repeat center center` }}>
      <h4 className='text-light h1 roboto'>Pronto para enviar uma mensagem?</h4>
      <p className={`text-light ${classes.Text} roboto`}>Adoraríamos conversar com você sobre como ajudar na implementação do sistema de controle de acesso em seu condomínio.</p>
      <button className='btn btn-primary' onClick={() => setModalEmail(true)}>Mensagem</button>
      <Modal isOpen={modalEmail} toggle={() => setModalEmail(false)}>
        <ModalHeader toggle={() => setModalEmail(false)}>Mensagem</ModalHeader>
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
            errorMessage && <div className="alert alert-danger text-center" role="alert">
              {errorMessage}
            </div>
          }
          <div className="text-center">
            <button type="submit" onClick={submitHandler} className="btn btn-primary mt-4">Enviar</button>
          </div>
        </ModalBody>
      </Modal>
    </section>
  );
};

export default Landscape;