import * as Constants from '../../services/constants'

//import pages
import EventList from '../../pages/Event/EventList';
import EventAdd from '../../pages/Event/EventAdd';

const EventListRoute = {
    key: 'EventList',
    path: '/events/list',
    component: EventList
}
const EventAddRoute = {
    key: 'EventAdd',
    path: '/events/add',
    component: EventAdd
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
    }
    return routes
    
}

export default EventRoutes;