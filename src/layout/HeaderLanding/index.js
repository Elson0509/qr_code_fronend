import React, { useState } from 'react'
import classes from './header.module.css'
import { useAuth } from '../../contexts/auth'
import { Alert, Spinner } from 'reactstrap'
import Icon from '../../components/Icon'
import GenericModal from '../../components/Modals/GenericModal'
import LoginLogoutButton from '../../components/Buttons/LoginLogoutButton'
import api from '../../services/api'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'

const HeaderLanding = () => {
  const { signIn, errorLoginMessage, setErrorLoginMessage } = useAuth()

  const [loginModal, setLoginModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('Login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  //modal forget
  const [forgetPassword, setForgetPassword] = useState(false)
  const [successMessageForget, setSuccessMessageForget] = useState('')
  const [errorMessageForget, setErrorMessageForget] = useState('')
  const [buttonDisable, setButtonDisable] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [emailForget, setEmailForget] = useState('')

  const submitHandler = ev => {
    ev.preventDefault();
    if (!Utils.validateEmail(email))
      return setErrorMessage('Email não válido')
    if (password.length < Constants.MIN_PASSWORD_SIZE)
      return setErrorMessage('Senha muito curta')
    setErrorMessage('')
    setErrorLoginMessage('')
    signIn(email, password)
  }

  const forgetPasswordHandler = _ => {
    setModalTitle('Esqueci minha senha')
    setForgetPassword(true)
  }

  const cancelForgetHandler = _ =>{
    setLoginModal(false)
    setForgetPassword(false)
    setErrorMessageForget('')
  }

  const submitForgetPasswordHandler = ev => {
    ev.preventDefault()
    if (!Utils.validateEmail(emailForget))
      return setErrorMessageForget('Email não válido')
    setSpinner(true)
    setErrorMessageForget('')
    api.post('user/forgotpass', {email: emailForget })
      .then(res => {
        setSpinner(false)
        setButtonDisable(true)
        setSuccessMessageForget(res.data.message)
      })
      .catch(err => {
        setSpinner(false)
        setErrorMessageForget(err.response?.data?.message || 'Um erro ocorreu.')
      })
  }

  return (
    <header className={classes.Header}>
      <div>
        <img src='/imgs/logo.jpg' alt='logo qr condo' height={150}/>
      </div>
      <div>
        <LoginLogoutButton login clicked={() => setLoginModal(true)}/>
      </div>
      <GenericModal modal={loginModal} toggle={() => setLoginModal(false)} title={modalTitle}>
        {
          !forgetPassword ?
            <form>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" aria-describedby="email Help" value={email} onChange={ev => setEmail(ev.target.value)} />
              </div>
              <div className="form-group mt-2">
                <label>Senha</label>
                <input type="password" className="form-control" aria-describedby="senha Help" value={password} onChange={ev => setPassword(ev.target.value)} />
              </div>
              {
                !!errorMessage &&
                <Alert color='danger' className='mt-2'>
                  {errorMessage}
                </Alert>
              }
              {
                !!errorLoginMessage &&
                <Alert color='danger' className='mt-2'>
                  {errorLoginMessage}
                </Alert>
              }
              <div className="form-group mt-2">
                <button type="submit" className="btn btn-primary mt-2 col-12" onClick={(ev) => submitHandler(ev)}>Entrar</button>
              </div>
              <div className="form-group">
                <button type="button"
                  onClick={() => forgetPasswordHandler()}
                  className="btn btn-link p-0 mt-2">Esqueci minha senha</button>
              </div>
            </form>
            :
            <div>
              {
                !successMessageForget &&
                <div className="form-group">
                  <label>Digite seu email para resetar a senha:</label>
                  <input type="email"
                    name="email"
                    className="form-control"
                    aria-describedby="emailHelp"
                    onChange={ev => setEmailForget(ev.target.value)}
                    value={emailForget}
                  />
                  {errorMessageForget && <div className="alert alert-danger p-0 text-center my-2" role="alert">
                    {errorMessageForget}
                  </div>}
                </div>
              }
              {
                successMessageForget &&
                <div className="alert alert-success p-0 text-center my-2" role="alert">
                  {successMessageForget}
                </div>
              }
              {
                spinner ?
                <div style={{ margin: '0 auto' }}>
                  <Spinner color="primary" />
                </div>
                :
                <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '20px'}}>
                  <button type="button" onClick={submitForgetPasswordHandler} className="btn btn-primary" disabled={buttonDisable}>Confirmar</button>
                  <button type="button" onClick={cancelForgetHandler} className="btn btn-secondary" disabled={buttonDisable}>Cancelar</button>
                </div>
              }
            </div>
        }
      </GenericModal>
    </header>
  );
};

export default HeaderLanding;