import React, {Fragment} from 'react';
import Header from '../Header'
import Footer from '../Footer';
import AccordionMenu from '../../components/AccordionMenu';
import BreadcrumbBody from '../../components/BreadcrumbBody';
import { ToastContainer } from 'react-toastify';

const Body = (props) => {
    return (
        <Fragment>
            <Header/>
            <div className='container-fluid' style={{paddingTop: '30px', paddingBottom: '30px'}}>
                <div className='row'>
                    <aside className='col-md-3 col-sm-12'>
                        <AccordionMenu/>
                    </aside>
                    <main className='col-md-9 col-sm-12'>
                        {!!props.breadcrumb && <BreadcrumbBody data={props.breadcrumb}/>}
                        {props.children}
                    </main>
                </div>
            </div>
            <ToastContainer/>
            <Footer/>
        </Fragment>
    );
};

export default Body;