import {lazy} from 'react';
import * as Constants from '../../services/constants'

//import pages
const EventListLazy = lazy(()=> import ('../../pages/Event/EventList'))
const EventAddLazy = lazy(()=> import ('../../pages/Event/EventAdd'))

const EventListRoute = {
    key: 'EventList',
    path: '/events/list',
    component: EventListLazy
}
const EventAddRoute = {
    key: 'EventAdd',
    path: '/events/add',
    component: EventAddLazy
}

const EventRoutes = userKind => {
    const routes = []
    switch(userKind){
        case(Constants.USER_KIND['RESIDENT']):
            routes.push(EventAddRoute)
            break
        case(Constants.USER_KIND['GUARD']):
            routes.push(EventAddRoute)
            break
        case(Constants.USER_KIND['SUPERINTENDENT']):
            routes.push(EventListRoute)
            routes.push(EventAddRoute)
            break
        case(Constants.USER_KIND['VISITOR']):
            break
        case(Constants.USER_KIND['THIRD']):
            break
        case(Constants.USER_KIND['ADM']):
            break
        default:
            break
    }
    return routes
    
}

export default EventRoutes;