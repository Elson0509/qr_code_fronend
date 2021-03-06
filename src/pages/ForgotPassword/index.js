import React, { useState } from 'react'
import api from '../../services/api';
import { validateEmail } from '../../services/util'
import { testStrongPassword } from '../../services/util'

const ForgotPassword = (props) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [buttonText, setButtonText] = useState('RESETAR')
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const submitHandler = ev => {
    ev.preventDefault()
    if (!validateEmail(email)) {
      return setErrorMessage('Email em formato não válido.')
    }
    if (!testStrongPassword(password)) {
      return setErrorMessage(`A senha deve ter pelo menos 8 caracteres, pelo menos 1 maiúsculo, 1 minúsculo, 1 número e 1 caractere especial.`)
    }
    if (password.trim() !== confirmPassword.trim()) {
      return setErrorMessage(`Senha e sua confirmação precisam ser iguais.`)
    }
    setErrorMessage('')
    setButtonDisabled(true)
    setButtonText('RESETANDO...')
    api.post(`/user/resetpass`, {
      email: email.trim(),
      password: password.trim(),
      token: props.match.params.token
    })
      .then(res => {
        setSuccessMessage(res.data.message)
      })
      .catch(err => {
        setErrorMessage(err.response?.data?.message || 'Um erro ocorreu.')
      })

  }

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <div className='col-lg-6 col-md-8 col-sm-10'>
          <form>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name='email'
                className="form-control"
                aria-describedby="emailHelp"
                value={email}
                onChange={ev => setEmail(ev.target.value)}
              />
              <small className="form-text text-muted">Seu email cadastrado</small>
            </div>
            <div className="form-group mt-2">
              <label>Nova senha</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
              />
            </div>
            <div className="form-group mt-2">
              <label>Repita a senha</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={ev => setConfirmPassword(ev.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary col-12 mt-4" onClick={submitHandler} disabled={buttonDisabled}>{buttonText}</button>
          </form>
          {
            errorMessage && <div className="alert alert-danger mt-4 mb-2 text-center p-1" role="alert">
              {errorMessage}
            </div>
          }
          {
            successMessage && <div className="alert alert-success text-center p-1 mt-2" role="alert">
              {successMessage}
            </div>
          }
          {
            successMessage && <div className="alert alert-info link text-center p-1" role="alert" onClick={() => props.history.push('/login')}>
              Clique aqui para ir para a tela de login.
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;