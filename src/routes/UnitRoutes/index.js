import React, {Fragment} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

//import pages
import UnitList from '../../pages/Unit/UnitList';
import UnitAdd from '../../pages/Unit/UnitAdd';

const UnitRoutes = [
    {
        key: 'unitList',
        path: '/units/list',
        component: UnitList
    },
    {
        key: 'unitAdd',
        path: '/units/add',
        component: UnitAdd
    },
]

export default UnitRoutes;