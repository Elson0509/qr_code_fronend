import React, { Fragment } from 'react'
import HeaderLanding from './HeaderLanding';
import WelcomeSection from '../WelcomeSection';
import Presentation from './Presentation';
import Icons from './Icons'
import Footer from '../Footer';
import Nav from './Nav';
import Showcase from './Showcase'
import Landscape from './Landscape';

const index = (props) => {
    return (
        <Fragment>
            <HeaderLanding />
            {/* <Presentation/> */}
            {/* <WelcomeSection/> */}
            <Nav/>
            <Icons/>
            <Showcase/>
            <Landscape/>
            <Footer/>
        </Fragment>
    );
};

export default index;