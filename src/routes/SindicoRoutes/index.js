import * as Constants from '../../services/constants'

//import pages
import SindicoList from '../../pages/Sindico/SindicoList'
import SindicoAdd from '../../pages/Sindico/SindicoAdd'

const SindicoListRoute = {
    key: 'SindicoList',
    path: '/sindico/list',
    component: SindicoList
}
const SindicoAddRoute = {
    key: 'SindicoAdd',
    path: '/sindico/add',
    component: SindicoAdd
}


const SindicoRoutes = userKind => {
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
            routes.push(SindicoListRoute, SindicoAddRoute)
            break
    }
    return routes
    
}

export default SindicoRoutes;