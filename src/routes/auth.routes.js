import React, { Suspense, lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

//loading lazy Suspense
import LoadingSuspense from '../components/LoadingSuspense';

//lazy components
const ActivateLazy = lazy(() => import('../pages/Activate'))
const FaqLazy = lazy(()=> import('../pages/Faq'))
const LandingLazy = lazy(() => import('../pages/Landing'))
const ServicesLazy = lazy(() => import('../pages/Services'))

const AuthRoutes = () => (
    <Suspense fallback={<LoadingSuspense />}>
        <Switch>
            <Route exact path='/' component={LandingLazy} />
            <Route exact path='/welcome/:token' component={ActivateLazy} />
            <Route exact path='/faq' component={FaqLazy} />
            <Route exact path='/services' component={ServicesLazy} />
            <Route exact path="/*">
                <Redirect to="/" />
            </Route>
        </Switch>
    </Suspense>
)

export default AuthRoutes;