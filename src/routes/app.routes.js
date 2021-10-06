import Dashboard from '../pages/Dashboard';
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

const AppRoutes = () => (
    <Switch>
        <Route exact path='/dashboard' component={Dashboard}/>
        <Route exact path="/login">
            <Redirect to="/dashboard" />
        </Route>
    </Switch>
)

export default AppRoutes;