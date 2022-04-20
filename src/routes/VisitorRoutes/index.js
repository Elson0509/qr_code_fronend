import { lazy } from 'react';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'

//import pages
const VisitorAddLazy = lazy(() => import('../../pages/Visitor/VisitorAdd'))
const VisitorEditLazy = lazy(() => import('../../pages/Visitor/VisitorEdit'))
const VisitorSearchLazy = lazy(() => import('../../pages/Visitor/VisitorSearch'))

const VisitorListRoute = {
    key: 'visitorList',
    path: '/visitors/list',
    component: VisitorSearchLazy
}
const VisitorAddRoute = {
    key: 'visitorAdd',
    path: '/visitors/add',
    component: VisitorAddLazy
}
const VisitorEditRoute = {
    key: 'visitorEdit',
    path: '/visitors/edit',
    component: VisitorEditLazy
}

const ResidentRoutes = user => {
    const routes = []
    switch (user.user_kind) {
        case (Constants.USER_KIND['RESIDENT']):
            if (Utils.canAddVisitors(user)) {
                routes.push(VisitorAddRoute, VisitorListRoute, VisitorEditRoute)
            }
            break
        case (Constants.USER_KIND['GUARD']):
            routes.push(VisitorListRoute)
            if (Utils.canAddVisitors(user)) {
                routes.push(VisitorAddRoute)
            }
            break
        case (Constants.USER_KIND['SUPERINTENDENT']):
            routes.push(VisitorListRoute, VisitorAddRoute, VisitorEditRoute)
            break
        case (Constants.USER_KIND['VISITOR']):
            break
        case (Constants.USER_KIND['THIRD']):
            break
        case (Constants.USER_KIND['ADM']):
            break
        default:
            break
    }
    return routes
}

export default ResidentRoutes;