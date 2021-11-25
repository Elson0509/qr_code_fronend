import * as Constants from '../../services/constants'

//import pages
import Slot from '../../pages/Slot'

const SlotRoute = {
    key: 'Slot',
    path: '/slot',
    component: Slot
}

const SlotRoutes = userKind => {
    const routes = []
    switch(userKind){
        case(Constants.USER_KIND['RESIDENT']):
            break
        case(Constants.USER_KIND['GUARD']):
            routes.push(SlotRoute)
            break
        case(Constants.USER_KIND['SUPERINTENDENT']):
            routes.push(SlotRoute)
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

export default SlotRoutes;