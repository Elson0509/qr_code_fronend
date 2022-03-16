import React, { Fragment } from 'react'
import HeaderLanding from '../../layout/Landing/HeaderLanding';
import Icons from '../../layout/Landing/Icons'
import Footer from '../../layout/Footer';
import Nav from '../../layout/Landing/Nav';
import Showcase from '../../layout/Landing/Showcase'
import Landscape from '../../layout/Landing/Landscape';

const Landing = () => {
    return (
        <Fragment>
            <HeaderLanding />
            <Nav/>
            <Icons/>
            <Showcase/>
            <Landscape/>
            <Footer/>
        </Fragment>
    );
};

export default Landing;