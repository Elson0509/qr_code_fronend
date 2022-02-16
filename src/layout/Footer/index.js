import React, { useState, Fragment } from 'react';
import classes from './Footer.module.css'
import Icon from '../../components/Icon'
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import FormComment from '../../components/Form/FormComment';
import { validateEmail } from '../../services/util'
import api from '../../services/api'
import * as Constants from '../../services/constants'
import { toast } from 'react-toastify';
import {
  faFacebook,
  faLinkedin,
  faInstagram,
  faYoutube
} from '@fortawesome/free-brands-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
  const [modalTerms, setModalTerms] = useState(false)
  const [modalPrivacy, setModalPrivacy] = useState(false)
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
      toast.info('Mensagem enviada com sucesso', Constants.TOAST_CONFIG)
      setModalEmail(false)
      setEmail({ email: '', subject: '', message: '' })
    })
    .catch(err => {
      console.log(err)
      setErrorMessage(err.response?.data?.message || 'Um erro ocorreu.')
    })
  }

  return (
    <Fragment>
      <footer className={classes.Footer}>
        <div className={classes.FooterSpace}>
          <div className={classes.FooterColumns}>
            <div className={classes.DivChild}>
              <h5 className={classes.TitleCompany}>
                <Icon icon='shield-alt' color='white' size='2x' />
                <span style={{ marginLeft: '5px' }}>QR Condo</span>
              </h5>
              <div className={classes.SubDiv}>
                <h6 className={classes.SubDivTitle}>Contato</h6>
                <ul>
                  <li>Tel: (21) 97509-3237 (Pedro Tarquínio)</li>
                  <li>Tel: (21) 99776-4893 (Wander Pedreira)</li>
                  <li>Email: <a href='mailto:contato@qrcondo.com.br'>contato@qrcondo.com.br</a></li>
                </ul>
              </div>
              <div className={classes.SocialmediaDiv}>
                <ul>
                  <li>
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="facebook">
                      <FontAwesomeIcon icon={faFacebook} size="2x" color='#3b5998 ' />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="instagram">
                      <FontAwesomeIcon icon={faInstagram} size="2x" color='#DD2A7B' />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="youtube">
                      <FontAwesomeIcon icon={faYoutube} size="2x" color='#c4302b' />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="linkedin">
                      <FontAwesomeIcon icon={faLinkedin} size="2x" color='#3b5998' />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className={classes.DivChild}>
              <h6 className={`${classes.SubDivTitle}`}>Fornecedor</h6>
              <a href='https://tarquinioepedreira.com.br/' target="_blank" rel="noopener noreferrer" >
                <img src='/imgs/rsz_logo-tp.png' alt='Logo Tarquínio e Pedreira' className={classes.ImgTP} />
              </a>
            </div>
            <div className={classes.DivChild}>
              <h6 className={`${classes.SubDivTitle} ${classes.TitleMessage}`}>Pronto para enviar uma mensagem?</h6>
              <p>
                Adoraríamos conversar com você sobre como ajudar na implementação do sistema de controle de acesso em seu condomínio.
              </p>
              <button className='btn btn-primary' onClick={() => setModalEmail(true)}>Mensagem</button>
            </div>
          </div>
          <div className={classes.FooterPrivacy}>
            <p>Copyright 2022, Todos os direitos reservados</p>
            <ul>
              <li><button className={classes.ButtonLink} onClick={() => setModalTerms(true)}>Termos e condições</button></li>
              <li><button className={classes.ButtonLink} onClick={() => setModalPrivacy(true)}>Política de privacidade</button></li>
            </ul>
          </div>
        </div>
      </footer>
      <Modal isOpen={modalTerms} toggle={() => setModalTerms(false)}>
        <ModalHeader toggle={() => setModalTerms(false)}>Termos e condições</ModalHeader>
        <ModalBody>
          Termos e condições
        </ModalBody>
      </Modal>
      <Modal isOpen={modalPrivacy} toggle={() => setModalPrivacy(false)}>
        <ModalHeader toggle={() => setModalPrivacy(false)}>Política de privacidade</ModalHeader>
        <ModalBody>
          Política de privacidade
        </ModalBody>
      </Modal>
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
    </Fragment>
  );
};

export default Footer;