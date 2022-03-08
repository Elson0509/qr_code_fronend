import React, { Fragment } from 'react'
import HeaderLanding from './HeaderLanding';
import WelcomeSection from '../WelcomeSection';
import Presentation from './Presentation';
import Icons from './Icons'
import Footer from '../Footer';
import Nav from './Nav';
import Showcase from './Showcase'

const index = (props) => {
    return (
        <Fragment>
            <HeaderLanding />
            {/* <Presentation/> */}
            {/* <WelcomeSection/> */}
            <Nav/>
            <Icons/>
            <Showcase/>
            <Footer/>
        </Fragment>
    );
};

export default index;