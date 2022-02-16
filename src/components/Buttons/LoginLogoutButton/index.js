import React from 'react';
import Icon from '../../Icon';
import classes from './LoginLogoutButton.module.css'

const LoginLogoutButton = (props) => {
    const icon = props.login ? 'sign-out-alt' : 'sign-out-alt'
    const text = props.login ? 'Login' : 'Log out'
    return (
        <button class={classes.Div} onClick={props.clicked}>
            <div>
                <Icon icon={icon} color='white' size='lg'/>
            </div>
            <div class={classes.Right}>
                {text}
            </div>
        </button>
    );
};

export default LoginLogoutButton;