import * as Constants from '../../services/constants'

//import pages
import CondoList from '../../pages/Condo/CondoList'
import CondoAdd from '../../pages/Condo/CondoAdd'
import CondoEdit from '../../pages/Condo/CondoEdit'

const CondoListRoute = {
    key: 'CondoList',
    path: '/condo/list',
    component: CondoList
}
const CondoAddRoute = {
    key: 'CondoAdd',
    path: '/condo/add',
    component: CondoAdd
}
const CondoEditRoute = {
    key: 'CondoEdit',
    path: '/condo/edit',
    component: CondoEdit
}

const CondoRoutes = userKind => {
    const routes = []
    switch(userKind){
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
    }
    return routes
    
}

export default CondoRoutes;