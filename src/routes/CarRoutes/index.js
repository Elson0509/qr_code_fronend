import {lazy} from 'react';
import * as Constants from '../../services/constants'

//import pages
const CarListLazy = lazy(()=> import ('../../pages/Car/CarList'))
const CarSearchLazy = lazy(()=> import ('../../pages/Car/CarSearch'))

const CarListRoute = { 
    key: 'CarList',
    path: '/car/list',
    component: CarListLazy
}

const CarSearchRoute = {
    key: 'CarSearch',
    path: '/car/search',
    component: CarSearchLazy
}

const CarRoutes = user => {
    const routes = []
    switch(user.user_kind){
        case(Constants.USER_KIND['RESIDENT']):
            break
        case(Constants.USER_KIND['GUARD']):
            routes.push(CarSearchRoute)
            break
        case(Constants.USER_KIND['SUPERINTENDENT']):
            routes.push(CarListRoute)
            routes.push(CarSearchRoute)
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

export default CarRoutes;