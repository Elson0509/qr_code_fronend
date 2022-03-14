import React, { Suspense, lazy } from 'react';
//import Signin from "../pages/Signin"
//import ForgotPassword from "../pages/ForgotPassword"
//import Activate from "../pages/Activate"
//import Landing from '../layout/Landing'
import { Route, Switch, Redirect } from 'react-router-dom'

//loading lazy Suspense
import LoadingSuspense from '../components/LoadingSuspense';

//lazy components
const LandingLazy = lazy(() => import('../layout/Landing'))
//const SigninLazy = lazy(() => import('../pages/Signin'))
//const ForgotPasswordLazy = lazy(() => import('../pages/ForgotPassword'))
const ActivateLazy = lazy(() => import('../pages/Activate'))

// const AuthRoutes = () => (
//     <Switch>
//         <Route exact path='/' component={Landing}/>
//         <Route exact path='/login' component={Signin}/>
//         <Route exact path='/forgot/:token' component={ForgotPassword}/>
//         <Route exact path='/welcome/:token' component={Activate}/>
//         <Route exact path="/*">
//             <Redirect to="/" />
//         </Route>
//     </Switch>
// )
const AuthRoutes = () => (
    <Suspense fallback={<LoadingSuspense />}>
        <Switch>
            <Route exact path='/' component={LandingLazy} />
            {/* <Route exact path='/login' component={SigninLazy} />
            <Route exact path='/forgot/:token' component={ForgotPasswordLazy} /> */}
            <Route exact path='/welcome/:token' component={ActivateLazy} />
            <Route exact path="/*">
                <Redirect to="/" />
            </Route>
        </Switch>
    </Suspense>
)

export default AuthRoutes;