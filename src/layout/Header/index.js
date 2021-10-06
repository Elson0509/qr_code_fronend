import React from 'react';
import classes from './header.module.css'
import {useAuth} from '../../contexts/auth'

const Header = () => {
    const { user, signOut } = useAuth()

    return (
        <header className={classes.Header}>
            <button onClick={()=> signOut()}>Log out</button>
        </header>
    );
};

export default Header;