import {lazy} from 'react';
import * as Constants from '../../services/constants'

//import pages
const UnitListLazy = lazy(()=> import ('../../pages/Unit/UnitList'))
const UnitAddLazy = lazy(()=> import ('../../pages/Unit/UnitAdd'))

const  UnitListRoute = {
    key: 'unitList',
    path: '/units/list',
    component: UnitListLazy
}
const  UnitAddRoute = {
    key: 'unitAdd',
    path: '/units/add',
    component: UnitAddLazy
}

const UnitRoutes = user => {
    const routes = []
    switch(user.user_kind){
        case(Constants.USER_KIND['RESIDENT']):
            break
        case(Constants.USER_KIND['GUARD']):
            break
        case(Constants.USER_KIND['SUPERINTENDENT']):
            routes.push(UnitListRoute, UnitAddRoute)
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

export default UnitRoutes;