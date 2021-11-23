import * as Constants from '../../services/constants'

//import pages
import VisitorList from '../../pages/Visitor/VisitorList';
import VisitorAdd from '../../pages/Visitor/VisitorAdd';
import VisitorEdit from '../../pages/Visitor/VisitorEdit';
import VisitorSearch from '../../pages/Visitor/VisitorSearch';

const VisitorListRoute = {
    key: 'visitorList',
    path: '/visitors/list',
    component: VisitorList
}
const VisitorAddRoute = {
    key: 'visitorAdd',
    path: '/visitors/add',
    component: VisitorAdd
}
const VisitorEditRoute = {
    key: 'visitorEdit',
    path: '/visitors/edit',
    component: VisitorEdit
}
const VisitorSearchRoute = {
    key: 'VisitorSearch',
    path: '/visitors/search',
    component: VisitorSearch
}

const ResidentRoutes = userKind => {
    const routes = []
    switch(userKind){
        case(Constants.USER_KIND['RESIDENT']):
            break
        case(Constants.USER_KIND['GUARD']):
            routes.push(VisitorListRoute, VisitorAddRoute, VisitorSearchRoute)
            break
        case(Constants.USER_KIND['SUPERINTENDENT']):
            routes.push(VisitorListRoute, VisitorAddRoute, VisitorEditRoute, VisitorSearchRoute)
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

export default ResidentRoutes;