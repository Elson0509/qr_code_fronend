import {lazy} from 'react';
import * as Constants from '../../services/constants'

//import pages
const GuardListLazy = lazy(()=> import ('../../pages/Guard/GuardList'))
const GuardAddLazy = lazy(()=> import ('../../pages/Guard/GuardAdd'))

const GuardListRoute = {
    key: 'GuardList',
    path: '/guards/list',
    component: GuardListLazy
}
const GuardAddRoute = {
    key: 'GuardAdd',
    path: '/guards/add',
    component: GuardAddLazy
}

const GuardRoutes = user => {
    const routes = []
    switch(user.user_kind){
        case(Constants.USER_KIND['RESIDENT']):
            break
        case(Constants.USER_KIND['GUARD']):
            break
        case(Constants.USER_KIND['SUPERINTENDENT']):
            routes.push(GuardListRoute)
            routes.push(GuardAddRoute)
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

export default GuardRoutes;