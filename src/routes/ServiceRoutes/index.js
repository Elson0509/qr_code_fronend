import { lazy } from 'react';
import * as Utils from '../../services/util'
import * as Constants from '../../services/constants'

//import pages
const NewsLazy = lazy(() => import('../../pages/ServicesMenu/News'))
const MailListLazy = lazy(() => import('../../pages/ServicesMenu/MailList'))
const MailAddLazy = lazy(() => import('../../pages/ServicesMenu/MailAdd'))

const NewsRoute = {
    key: 'News',
    path: '/services/news',
    component: NewsLazy
}
const MailListRoute = {
    key: 'Mail',
    path: '/services/maillist',
    component: MailListLazy
}
const MailAddRoute = {
    key: 'Mail',
    path: '/services/mailadd',
    component: MailAddLazy
}

const SlotRoutes = user => {
    const routes = []
    switch (user.user_kind) {
        case (Constants.USER_KIND['RESIDENT']):
            if (Utils.condoHasNews(user))
                routes.push(NewsRoute)
            if (Utils.condoHasMail(user))
                routes.push(MailListRoute)
            break
        case (Constants.USER_KIND['GUARD']):
            if (Utils.condoHasMail(user))
                routes.push(MailListRoute, MailAddRoute)
            break
        case (Constants.USER_KIND['SUPERINTENDENT']):
            if (Utils.condoHasNews(user))
                routes.push(NewsRoute)
            if (Utils.condoHasMail(user))
                routes.push(MailListRoute, MailAddRoute)
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