import React, {Fragment} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

//import pages
import ResidentList from '../../pages/Resident/ResidentList';
import ResidentSearch from '../../pages/Resident/ResidentSearch'
import ResidentAdd from '../../pages/Resident/ResidentAdd';
import ResidentEdit from '../../pages/Resident/ResidentEdit';

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
    {
        key: 'residentAdd',
        path: '/residents/add',
        component: ResidentAdd
    },
    {
        key: 'residentEdit',
        path: '/residents/edit',
        component: ResidentEdit
    },
    
]

export default ResidentRoutes;