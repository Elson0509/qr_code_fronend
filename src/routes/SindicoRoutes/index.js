import {lazy} from 'react';
import * as Constants from '../../services/constants'

//import pages
const SindicoListLazy = lazy(()=> import ('../../pages/Sindico/SindicoList'))
const SindicoAddLazy = lazy(()=> import ('../../pages/Sindico/SindicoAdd'))

const SindicoListRoute = {
    key: 'SindicoList',
    path: '/sindico/list',
    component: SindicoListLazy
}
const SindicoAddRoute = {
    key: 'SindicoAdd',
    path: '/sindico/add',
    component: SindicoAddLazy
}


const SindicoRoutes = user => {
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
            routes.push(SindicoListRoute, SindicoAddRoute)
            break
        default:
            break
    }
    return routes
    
}

export default SindicoRoutes;