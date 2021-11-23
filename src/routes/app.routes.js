import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import {useAuth} from '../contexts/auth'
//import pages
import Dashboard from '../pages/Dashboard';
import Scan from '../pages/Scan'
import MyQrCode from '../pages/MyQrCode';

//routes
import CarRoutes from './CarRoutes';
import CondoRoutes from './CondoRoutes';
import GuardRoutes from './GuardRoutes';
import EventRoutes from './EventRoutes';
import MessageRoutes from './MessageRoutes';
import ResidentRoutes from './ResidentRoutes';
import SindicoRoutes from './SindicoRoutes';
import SlotRoutes from './SlotRoutes';
import ThirdRoutes from './ThirdRoutes';
import UnitRoutes from './UnitRoutes';
import VisitorRoutes from './VisitorRoutes'


const AppRoutes = () => {
    const { user } = useAuth()
    return (
        <Switch>
            <Route exact path='/dashboard' component={Dashboard}/>
            <Route exact path='/scan' component={Scan}/>
            <Route exact path='/myqrcode' component={MyQrCode}/>
            { CarRoutes(user.user_kind).map(el=> <Route exact {...el}/>) }
            { CondoRoutes(user.user_kind).map(el=> <Route exact {...el}/>) }
            { EventRoutes(user.user_kind).map(el=> <Route exact {...el}/>) }
            { GuardRoutes(user.user_kind).map(el=> <Route exact {...el}/>) }
            { MessageRoutes.map(el=> <Route exact {...el}/>) }
            { ResidentRoutes(user.user_kind).map(el=> <Route exact {...el}/>) }
            { SindicoRoutes(user.user_kind).map(el=> <Route exact {...el}/>) }
            { SlotRoutes(user.user_kind).map(el=> <Route exact {...el}/>) }
            { ThirdRoutes(user.user_kind).map(el=> <Route exact {...el}/>) }
            { UnitRoutes(user.user_kind).map(el=> <Route exact {...el}/>) }
            { VisitorRoutes(user.user_kind).map(el=> <Route exact {...el}/>) }
            
            <Route exact path="/login">
                <Redirect to="/dashboard" />
            </Route>
            <Route exact path="/*">
                <Redirect to="/dashboard" />
            </Route>
        </Switch>
    )
}

export default AppRoutes;