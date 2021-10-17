import React, {Fragment} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

//import pages
import ResidentList from '../../pages/Resident/ResidentList';
import ResidentSearch from '../../pages/Resident/ResidentSearch'


const ResidentRoutes = [
    {
        key: 'residentList',
        path: '/residents/list',
        component: ResidentList
    },
    {
        key: 'residentSearch',
        path: '/residents/search',
        component: ResidentSearch
    },
    
]

export default ResidentRoutes;