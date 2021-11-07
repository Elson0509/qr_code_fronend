import React, {useState}  from 'react';
import {useAuth} from '../../contexts/auth';
import * as Utils from '../../services/util'
import { Alert } from 'reactstrap'
import * as Constants from '../../services/constants'

const SignIn = (props) => {
    const {signed, signIn, errorLoginMessage, setErrorLoginMessage} = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const submitHandler = ev => {
        ev.preventDefault();
        if(!Utils.validateEmail(email))
            return setErrorMessage('Email não válido')
        if(password.length<Constants.MIN_PASSWORD_SIZE)
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
                            <input type="email" className="form-control" aria-describedby="email Help" value={email} onChange={ev=>setEmail(ev.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Senha</label>
                            <input type="password" className="form-control" aria-describedby="senha Help" value={password} onChange={ev=>setPassword(ev.target.value)}/>
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
                        <button type="submit" className="btn btn-primary mt-2" onClick={(ev)=> submitHandler(ev)}>Entrar</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default SignIn;