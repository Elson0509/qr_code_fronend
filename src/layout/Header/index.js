import React from 'react';
import classes from './header.module.css'
import { useAuth } from '../../contexts/auth'
import LoginLogoutButton from '../../components/Buttons/LoginLogoutButton';

const Header = () => {
  const { signOut } = useAuth()

  return (
    <header className={classes.Header}>
      <div>
        <img src='/imgs/logo-h-min.jpg' alt='logo qr condo' height={110} />
      </div>
      <div>
        <LoginLogoutButton clicked={() => signOut()}/>
      </div>

    </header>
  );
};

export default Header;