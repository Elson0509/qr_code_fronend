import * as Constants from '../../services/constants'

//import pages
import ThirdList from "../../pages/Third/ThirdList";
import ThirdAdd from "../../pages/Third/ThirdAdd";
import ThirdEdit from "../../pages/Third/ThirdEdit";
import ThirdSearch from '../../pages/Third/ThirdSearch';

const ThirdListRoute = {
    key: 'ThirdList',
    path: '/thirds/list',
    component: ThirdList
}
const ThirdAddRoute = {
    key: 'ThirdAdd',
    path: '/thirds/add',
    component: ThirdAdd
}
const ThirdSearchRoute = {
    key: 'ThirdSearch',
    path: '/thirds/search',
    component: ThirdSearch
}
const ThirdEditRoute = {
    key: 'ThirdEdit',
    path: '/thirds/edit',
    component: ThirdEdit
}

const ThirdRoutes = userKind => {
    const routes = []
    switch(userKind){
        case(Constants.USER_KIND['RESIDENT']):
            break
        case(Constants.USER_KIND['GUARD']):
            routes.push(ThirdAddRoute, ThirdListRoute, ThirdSearchRoute)
            break
        case(Constants.USER_KIND['SUPERINTENDENT']):
            routes.push(ThirdListRoute, ThirdAddRoute, ThirdEditRoute, ThirdSearchRoute)
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

export default ThirdRoutes;