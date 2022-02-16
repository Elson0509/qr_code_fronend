import React from 'react';
import Icon from '../../Icon';
import classes from './LoginLogoutButton.module.css'

const LoginLogoutButton = (props) => {
    const icon = props.login ? 'sign-out-alt' : 'sign-out-alt'
    const text = props.login ? 'Login' : 'Log out'
    return (
        <button className={classes.Div} onClick={props.clicked}>
            <div>
                <Icon icon={icon} color='white' size='lg'/>
            </div>
            <div className={classes.Right}>
                {text}
            </div>
        </button>
    );
};

export default LoginLogoutButton;