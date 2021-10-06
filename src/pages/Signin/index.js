import React  from 'react';
import {useAuth} from '../../contexts/auth';

const SignIn = () => {
    const {signed, signIn} = useAuth()

    const handleSignIn = _ => {
        signIn()
    }

    return (
        <div>
            <button onClick={()=>handleSignIn()}>Sign In</button>
        </div>
    );
};

export default SignIn;