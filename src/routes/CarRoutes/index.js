import * as Constants from '../../services/constants'

//import pages
import CarList from '../../pages/Car/CarList';
import CarSearch from '../../pages/Car/CarSearch';

const CarListRoute = { 
    key: 'CarList',
    path: '/car/list',
    component: CarList
}

const CarSearchRoute = {
    key: 'CarSearch',
    path: '/car/search',
    component: CarSearch
}

const CarRoutes = userKind => {
    const routes = []
    switch(userKind){
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