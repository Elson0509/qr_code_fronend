import Signin from "../pages/Signin";
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

const AuthRoutes = () => (
    <Switch>
        <Route exact path='/' component={Signin}/>
    </Switch>
)

export default AuthRoutes;