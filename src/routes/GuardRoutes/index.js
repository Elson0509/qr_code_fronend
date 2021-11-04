import React, {Fragment} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

//import pages
import GuardList from '../../pages/Guard/GuardList';
import GuardAdd from '../../pages/Guard/GuardAdd';

const GuardRoutes = [
    {
        key: 'GuardList',
        path: '/guards/list',
        component: GuardList
    },
    {
        key: 'GuardAdd',
        path: '/guards/add',
        component: GuardAdd
    },
    
]

export default GuardRoutes;