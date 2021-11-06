import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

//import pages
import Dashboard from '../pages/Dashboard';
import Scan from '../pages/Scan'
import MyQrCode from '../pages/MyQrCode';

//routes
import CarRoutes from './CarRoutes';
import EventRoutes from './EventRoutes';
import UnitRoutes from './UnitRoutes';
import ResidentRoutes from './ResidentRoutes';
import VisitorRoutes from './VisitorRoutes'
import ThirdRoutes from './ThirdRoutes';
import GuardRoutes from './GuardRoutes';

const AppRoutes = () => (
    <Switch>
        <Route exact path='/dashboard' component={Dashboard}/>
        <Route exact path='/scan' component={Scan}/>
        <Route exact path='/myqrcode' component={MyQrCode}/>
        {
            CarRoutes.map(el=> <Route exact {...el}/>)
        }
        {
            UnitRoutes.map(el=> <Route exact {...el}/>)
        }
        {
            ResidentRoutes.map(el=> <Route exact {...el}/>)
        }
        {
            VisitorRoutes.map(el=> <Route exact {...el}/>)
        }
        {
            ThirdRoutes.map(el=> <Route exact {...el}/>)
        }
        {
            GuardRoutes.map(el=> <Route exact {...el}/>)
        }
        {
            EventRoutes.map(el=> <Route exact {...el}/>)
        }
        <Route exact path="/login">
            <Redirect to="/dashboard" />
        </Route>
        <Route exact path="/*">
            <Redirect to="/dashboard" />
        </Route>
        
    </Switch>
)

export default AppRoutes;