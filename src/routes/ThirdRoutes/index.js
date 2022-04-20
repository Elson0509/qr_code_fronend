import { lazy } from 'react';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'

//import pages
const ThirdAddLazy = lazy(() => import('../../pages/Third/ThirdAdd'))
const ThirdEditLazy = lazy(() => import('../../pages/Third/ThirdEdit'))
const ThirdSearchLazy = lazy(() => import('../../pages/Third/ThirdSearch'))

const ThirdListRoute = {
  key: 'ThirdList',
  path: '/thirds/list',
  component: ThirdSearchLazy
}
const ThirdAddRoute = {
  key: 'ThirdAdd',
  path: '/thirds/add',
  component: ThirdAddLazy
}

const ThirdEditRoute = {
  key: 'ThirdEdit',
  path: '/thirds/edit',
  component: ThirdEditLazy
}

const ThirdRoutes = user => {
  const routes = []
  switch (user.user_kind) {
    case (Constants.USER_KIND['RESIDENT']):
      if (Utils.canAddThirds(user)) {
        routes.push(ThirdAddRoute, ThirdListRoute, ThirdEditRoute)
      }
      break
    case (Constants.USER_KIND['GUARD']):
      routes.push(ThirdListRoute)
      if (Utils.canAddThirds(user)) {
        routes.push(ThirdAddRoute)
      }
      break
    case (Constants.USER_KIND['SUPERINTENDENT']):
      routes.push(ThirdListRoute, ThirdAddRoute, ThirdEditRoute)
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

export default ThirdRoutes;