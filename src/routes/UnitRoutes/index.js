import * as Constants from '../../services/constants'

//import pages
import UnitList from '../../pages/Unit/UnitList';
import UnitAdd from '../../pages/Unit/UnitAdd';

const  UnitListRoute = {
    key: 'unitList',
    path: '/units/list',
    component: UnitList
}
const  UnitAddRoute = {
    key: 'unitAdd',
    path: '/units/add',
    component: UnitAdd
}

const UnitRoutes = userKind => {
    const routes = []
    switch(userKind){
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