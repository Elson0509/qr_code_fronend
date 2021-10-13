import React, {Fragment} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

//import pages
import ResidentList from '../../pages/Resident/ResidentList';


const ResidentRoutes = [
    {
        key: 'residentList',
        path: '/residents/list',
        component: ResidentList
    },
    
]

export default ResidentRoutes;