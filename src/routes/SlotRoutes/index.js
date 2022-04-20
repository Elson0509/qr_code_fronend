import {lazy} from 'react';
import * as Constants from '../../services/constants'

//import pages
const SlotLazy = lazy(()=> import ('../../pages/Slot'))

const SlotRoute = {
    key: 'Slot',
    path: '/slot',
    component: SlotLazy
}

const SlotRoutes = user => {
    const routes = []
    switch(user.user_kind){
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