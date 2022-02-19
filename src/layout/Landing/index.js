import React, { Fragment } from 'react'
import HeaderLanding from './HeaderLanding';
import WelcomeSection from '../WelcomeSection';
import Presentation from './Presentation';
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
            <Showcase/>
            <Footer/>
        </Fragment>
    );
};

export default index;