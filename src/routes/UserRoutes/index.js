import { lazy } from 'react';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'

//import pages
const EditUserLazy = lazy(() => import('../../pages/EditUser'))
const EditThirdLazy = lazy(() => import('../../pages/EditThird'))
const EditVisitorLazy = lazy(() => import('../../pages/EditVisitor'))

const EditUserRoute = {
    key: 'edituser',
    path: '/resident/edit',
    component: EditUserLazy
}

const EditThirdRoute = {
    key: 'editthird',
    path: '/third/edit',
    component: EditThirdLazy
}

const EditVisitorRoute = {
    key: 'editvisitor',
    path: '/visitor/edit',
    component: EditVisitorLazy
}

const UnitRoutes = user => {
    const routes = []
    switch (user.user_kind) {
        case (Constants.USER_KIND['RESIDENT']):
            if (Utils.canAddThirds(user)) {
                routes.push(EditThirdRoute)
            }
            if (Utils.canAddVisitors(user)) {
                routes.push(EditVisitorRoute)
            }
            break
        case (Constants.USER_KIND['GUARD']):
            break
        case (Constants.USER_KIND['SUPERINTENDENT']):
            if (Utils.canAddThirds(user)) {
                routes.push(EditThirdRoute)
            }
            if (Utils.canAddVisitors(user)) {
                routes.push(EditVisitorRoute)
            }
            routes.push(EditUserRoute)
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

export default UnitRoutes;