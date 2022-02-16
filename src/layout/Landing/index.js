import React, { Fragment } from 'react'
import HeaderLanding from '../HeaderLanding';
import WelcomeSection from '../WelcomeSection';
import Footer from '../Footer';

const index = (props) => {
    return (
        <Fragment>
            <HeaderLanding />
            <WelcomeSection/>
            <Footer/>
        </Fragment>
    );
};

export default index;