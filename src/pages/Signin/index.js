import React, { useState } from 'react';
import * as Utils from '../../services/util'
import * as Constants from '../../services/constants'
import { useAuth } from '../../contexts/auth';
import { Alert } from 'reactstrap'
import ForgetPasswordModal from '../../components/Modals/ForgetPasswordModal';

const SignIn = (props) => {
  const { signIn, errorLoginMessage, setErrorLoginMessage } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [forgetPasswordModal, setForgetPasswordModal] = useState(false)

  const submitHandler = async ev => {
    ev.preventDefault();
    const isConnected = await Utils.checkInternetConnection()
    if (!isConnected) {
      return
    }
    if (!Utils.validateEmail(email))
      return setErrorMessage('Email não válido')
    if (password.length < Constants.MIN_PASSWORD_SIZE)
      return setErrorMessage('Senha muito curta')
    setErrorMessage('')
    setErrorLoginMessage('')
    signIn(email, password)
  }

  return (
    <section className='container'>
      <div className='row justify-content-center'>
        <div className='col-8'>
          <form>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email</label>
              <input type="email" className="form-control" aria-describedby="email Help" value={email} onChange={ev => setEmail(ev.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Senha</label>
              <input type="password" className="form-control" aria-describedby="senha Help" value={password} onChange={ev => setPassword(ev.target.value)} />
            </div>
            {!!errorMessage &&
              <Alert color='danger' className='mt-2'>
                {errorMessage}
              </Alert>
            }
            {!!errorLoginMessage &&
              <Alert color='danger' className='mt-2'>
                {errorLoginMessage}
              </Alert>
            }
            <div className="form-group">
              <button type="submit" className="btn btn-primary mt-2 col-12" onClick={(ev) => submitHandler(ev)}>Entrar</button>
            </div>
            <div className="form-group">
              <button type="button"
                onClick={() => setForgetPasswordModal(true)}
                className="btn btn-link p-0 mt-2">Esqueci minha senha</button>
            </div>
          </form>
        </div>
      </div>
      <ForgetPasswordModal
        modal={forgetPasswordModal}
        toggle={() => setForgetPasswordModal(false)}
        title='Esqueci minha senha'
      />
    </section>
  );
};

export default SignIn;