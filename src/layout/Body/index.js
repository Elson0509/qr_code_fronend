import React, {Fragment} from 'react';
import Header from '../Header'
import AccordionMenu from '../../components/AccordionMenu';
import BreadcrumbBody from '../../components/BreadcrumbBody';

const Body = (props) => {
    return (
        <Fragment>
            <Header/>
            <div className='container-fluid' style={{paddingTop: '15px'}}>
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
        </Fragment>
    );
};

export default Body;