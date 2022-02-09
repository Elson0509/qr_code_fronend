import React from 'react';
import classes from './header.module.css'
import {useAuth} from '../../contexts/auth'
import Icon from '../../components/Icon';

const Header = () => {
    const { user, signOut } = useAuth()

    return (
        <header className={classes.Header}>
            <div className={classes.EmptyDiv}></div>
            <div>
                logo
            </div>
            <div>
                <button className={classes.ButtonLogout} onClick={()=> signOut()}>
                    <span style={{marginRight: '7px'}}>Log out</span>
                    <Icon icon='sign-out-alt'/>
                </button>
            </div>
            
        </header>
    );
};

export default Header;