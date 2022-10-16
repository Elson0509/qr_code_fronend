import { lazy } from 'react';
import * as Utils from '../../services/util'
import * as Constants from '../../services/constants'

//import pages
const NewsLazy = lazy(() => import('../../pages/ServicesMenu/News'))
const MailLazy = lazy(() => import('../../pages/ServicesMenu/MailList'))

const NewsRoute = {
    key: 'News',
    path: '/services/news',
    component: NewsLazy
}
const MailRoute = {
    key: 'Mail',
    path: '/services/maillist',
    component: MailLazy
}

const SlotRoutes = user => {
    const routes = []
    switch (user.user_kind) {
        case (Constants.USER_KIND['RESIDENT']):
            if (Utils.condoHasNews(user))
                routes.push(NewsRoute)
            if (Utils.condoHasMail(user))
                routes.push(MailRoute)
            break
        case (Constants.USER_KIND['GUARD']):
            if (Utils.condoHasMail(user))
                routes.push(MailRoute)
            break
        case (Constants.USER_KIND['SUPERINTENDENT']):
            if (Utils.condoHasNews(user))
                routes.push(NewsRoute)
            if (Utils.condoHasMail(user))
                routes.push(MailRoute)
            break
        case (Constants.USER_KIND['VISITOR']):
            break
        case (Constants.USER_KIND['THIRD']):
            break
        case (Constants.USER_KIND['ADM']):
            break
        default:
            break
    }
    return routes

}

export default SlotRoutes;