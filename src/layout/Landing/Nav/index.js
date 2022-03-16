import React from 'react';
import { Link } from 'react-router-dom'
import classes from './Nav.module.css'
import Icon from '../../../components/Icon'

const Nav = () => {
    return (
        <nav className={classes.Nav}>
            <ul>
                <li>
                    <Link to={'/'} > <Icon icon='home' size='lg'/> Principal</Link>
                </li>
                <li>
                    <Link to={'/'} ><Icon icon='shopping-bag' size='lg'/> Serviços</Link>
                </li>
                <li>
                    <Link to={'/'} ><Icon icon='dollar-sign' size='lg'/> Assinatura</Link>
                </li>
                <li>
                    <Link to={'/faq'} > <Icon icon='question' size='lg'/> FAQ</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Nav;