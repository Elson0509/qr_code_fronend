import {lazy} from 'react';
import * as Constants from '../../services/constants'

//import pages
const CondoListLazy = lazy(()=> import ('../../pages/Condo/CondoList'))
const CondoAddLazy = lazy(()=> import ('../../pages/Condo/CondoAdd'))
const CondoEditLazy = lazy(()=> import ('../../pages/Condo/CondoEdit'))

const CondoListRoute = {
    key: 'CondoList',
    path: '/condo/list',
    component: CondoListLazy
}
const CondoAddRoute = {
    key: 'CondoAdd',
    path: '/condo/add',
    component: CondoAddLazy
}
const CondoEditRoute = {
    key: 'CondoEdit',
    path: '/condo/edit',
    component: CondoEditLazy
}

const CondoRoutes = user => {
    const routes = []
    switch(user.user_kind){
        case(Constants.USER_KIND['RESIDENT']):
            break
        case(Constants.USER_KIND['GUARD']):
            break
        case(Constants.USER_KIND['SUPERINTENDENT']):
            break
        case(Constants.USER_KIND['VISITOR']):
            break
        case(Constants.USER_KIND['THIRD']):
            break
        case(Constants.USER_KIND['ADM']):
            routes.push(CondoListRoute, CondoAddRoute, CondoEditRoute)
            break
        default:
            break
    }
    return routes
    
}

export default CondoRoutes;