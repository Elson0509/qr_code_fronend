import React, {Fragment} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

//import pages
import EventList from '../../pages/Event/EventList';
import EventAdd from '../../pages/Event/EventAdd';

const EventRoutes = [
    {
        key: 'EventList',
        path: '/events/list',
        component: EventList
    },
    {
        key: 'EventAdd',
        path: '/events/add',
        component: EventAdd
    },
    
]

export default EventRoutes;