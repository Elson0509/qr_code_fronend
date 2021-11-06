import React, {Fragment} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

//import pages
import CarList from '../../pages/Car/CarList';
import CarSearch from '../../pages/Car/CarSearch';

const CarRoutes = [
    {
        key: 'CarList',
        path: '/car/list',
        component: CarList
    },
    {
        key: 'CarSearch',
        path: '/car/search',
        component: CarSearch
    },

    
]

export default CarRoutes;