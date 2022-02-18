import React, { Fragment } from 'react'
import HeaderLanding from './HeaderLanding';
import WelcomeSection from '../WelcomeSection';
import Presentation from './Presentation';
import Footer from '../Footer';

const index = (props) => {
    return (
        <Fragment>
            <HeaderLanding />
            {/* <Presentation/> */}
            <WelcomeSection/>
            <Footer/>
        </Fragment>
    );
};

export default index;