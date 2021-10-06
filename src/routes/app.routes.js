import Dashboard from '../pages/Dashboard';
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

const AppRoutes = () => (
    <Switch>
        <Route exact path='/' component={Dashboard}/>
    </Switch>
)

export default AppRoutes;