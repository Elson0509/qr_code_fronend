import {lazy} from 'react';
//import pages
const MessageListLazy = lazy(()=> import ('../../pages/Message/MessageList'))


const MessageRoutes = [
    {
        key: 'MessageList',
        path: '/message/list',
        component: MessageListLazy
    },
    
]

export default MessageRoutes;