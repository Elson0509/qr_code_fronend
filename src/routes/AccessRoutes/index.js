import { lazy } from 'react';
import * as Constants from '../../services/constants'

//import pages
const AccessLazy = lazy(() => import('../../pages/Access'))

const AccessRoute = {
    key: 'Access',
    path: '/access',
    component: AccessLazy
}

const AccessRoutes = user => {
    const routes = []
    switch (user.user_kind) {
        case (Constants.USER_KIND['RESIDENT']):
            break
        case (Constants.USER_KIND['GUARD']):
            break
        case (Constants.USER_KIND['SUPERINTENDENT']):
            routes.push(AccessRoute)
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

export default AccessRoutes;