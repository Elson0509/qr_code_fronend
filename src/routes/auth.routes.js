import React, { Suspense, lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

//loading lazy Suspense
import LoadingSuspense from '../components/LoadingSuspense';

//lazy components
const ActivateLazy = lazy(() => import('../pages/Activate'))
const FaqLazy = lazy(()=> import('../pages/Faq'))
const LandingLazy = lazy(() => import('../pages/Landing'))
const PriceLazy = lazy(() => import('../pages/Price'))
const ServicesLazy = lazy(() => import('../pages/Services'))
const ForgotLazy = lazy(() => import('../pages/ForgotPassword'))
const PrivacyLazy = lazy(() => import('../pages/Privacy'))

const AuthRoutes = () => (
    <Suspense fallback={<LoadingSuspense />}>
        <Switch>
            <Route exact path='/' component={LandingLazy} />
            <Route exact path='/welcome/:token' component={ActivateLazy} />
            <Route exact path='/faq' component={FaqLazy} />
            <Route exact path='/forgot/:token' component={ForgotLazy} />
            <Route exact path='/services' component={ServicesLazy} />
            <Route exact path='/price' component={PriceLazy} />
            <Route exact path='/privacy' component={PrivacyLazy} />
            <Route exact path="/*">
                <Redirect to="/" />
            </Route>
        </Switch>
    </Suspense>
)

export default AuthRoutes;