import React, {Fragment} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

//import pages
import EventList from '../../pages/Event/EventList';


const EventRoutes = [
    {
        key: 'EventList',
        path: '/events/list',
        component: EventList
    },
    
]

export default EventRoutes;