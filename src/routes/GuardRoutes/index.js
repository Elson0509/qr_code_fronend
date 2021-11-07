import * as Constants from '../../services/constants'

//import pages
import GuardList from '../../pages/Guard/GuardList';
import GuardAdd from '../../pages/Guard/GuardAdd';

const GuardListRoute = {
    key: 'GuardList',
    path: '/guards/list',
    component: GuardList
}
const GuardAddRoute = {
    key: 'GuardAdd',
    path: '/guards/add',
    component: GuardAdd
}

const GuardRoutes = userKind => {
    const routes = []
    switch(userKind){
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
    }
    return routes
    
}

export default GuardRoutes;