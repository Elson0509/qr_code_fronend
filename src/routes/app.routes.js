import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

//import pages
import Dashboard from '../pages/Dashboard';
import Scan from '../pages/Scan'
import MyQrCode from '../pages/MyQrCode';

const AppRoutes = () => (
    <Switch>
        <Route exact path='/dashboard' component={Dashboard}/>
        <Route exact path='/scan' component={Scan}/>
        <Route exact path='/myqrcode' component={MyQrCode}/>
        <Route exact path="/login">
            <Redirect to="/dashboard" />
        </Route>
        <Route exact path="/*">
            <Redirect to="/dashboard" />
        </Route>
    </Switch>
)

export default AppRoutes;