import {lazy} from 'react';
import * as Constants from '../../services/constants'


//import pages
const ResidentSearchLazy = lazy(()=> import ('../../pages/Resident/ResidentSearch'))
const ResidentAddLazy = lazy(()=> import ('../../pages/Resident/ResidentAdd'))
const ResidentEditLazy = lazy(()=> import ('../../pages/Resident/ResidentEdit'))

const ResidentListRoute = {
    key: 'residentList',
    path: '/residents/list',
    component: ResidentSearchLazy
}
const ResidentAddRoute = {
    key: 'residentAdd',
    path: '/residents/add',
    component: ResidentAddLazy
}
const ResidentEditRoute = {
    key: 'residentEdit',
    path: '/residents/edit',
    component: ResidentEditLazy
}

const ResidentRoutes = userKind => {
    const routes = []
    switch(userKind){
        case(Constants.USER_KIND['RESIDENT']):
            break
        case(Constants.USER_KIND['GUARD']):
            routes.push(ResidentListRoute)
            break
        case(Constants.USER_KIND['SUPERINTENDENT']):
            routes.push(ResidentListRoute, ResidentAddRoute, ResidentEditRoute)
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

export default ResidentRoutes;