import Signin from "../pages/Signin"
import ForgotPassword from "../pages/ForgotPassword"
import Activate from "../pages/Activate"
import React from 'react'
import Landing from '../layout/Landing'
import { Route, Switch, Redirect } from 'react-router-dom'

const AuthRoutes = () => (
    <Switch>
        <Route exact path='/' component={Landing}/>
        <Route exact path='/login' component={Signin}/>
        <Route exact path='/forgot/:token' component={ForgotPassword}/>
        <Route exact path='/welcome/:token' component={Activate}/>
        <Route exact path="/*">
            <Redirect to="/" />
        </Route>
    </Switch>
)

export default AuthRoutes;