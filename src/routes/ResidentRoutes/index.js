import * as Constants from '../../services/constants'

//import pages
import ResidentList from '../../pages/Resident/ResidentList';
import ResidentSearch from '../../pages/Resident/ResidentSearch'
import ResidentAdd from '../../pages/Resident/ResidentAdd';
import ResidentEdit from '../../pages/Resident/ResidentEdit';

const ResidentListRoute = {
    key: 'residentList',
    path: '/residents/list',
    component: ResidentList
}
const ResidentSearchRoute = {
    key: 'residentSearch',
    path: '/residents/search',
    component: ResidentSearch
}
const ResidentAddRoute = {
    key: 'residentAdd',
    path: '/residents/add',
    component: ResidentAdd
}
const ResidentEditRoute = {
    key: 'residentEdit',
    path: '/residents/edit',
    component: ResidentEdit
}

const ResidentRoutes = userKind => {
    const routes = []
    switch(userKind){
        case(Constants.USER_KIND['RESIDENT']):
            break
        case(Constants.USER_KIND['GUARD']):
            routes.push(ResidentListRoute, ResidentSearchRoute)
            break
        case(Constants.USER_KIND['SUPERINTENDENT']):
            routes.push(ResidentListRoute, ResidentSearchRoute, ResidentAddRoute, ResidentEditRoute)
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

export default ResidentRoutes;