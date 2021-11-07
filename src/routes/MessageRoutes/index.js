import React, {Fragment} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

//import pages
import MessageList from '../../pages/Message/MessageList';


const MessageRoutes = [
    {
        key: 'MessageList',
        path: '/message/list',
        component: MessageList
    },
    
]

export default MessageRoutes;