import Signin from "../pages/Signin";
import ForgotPassword from "../pages/ForgotPassword";
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

const AuthRoutes = () => (
    <Switch>
        <Route exact path='/login' component={Signin}/>
        <Route exact path='/forgot/:token' component={ForgotPassword}/>
        <Route exact path="/*">
            <Redirect to="/login" />
        </Route>
    </Switch>
)

export default AuthRoutes;