import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom'
import classes from './BreadcrumbBody.module.css'

const BreadcrumbBody = (props) => {
    return (
        <div className={classes.BreadCrumb}>
            <Breadcrumb>
            {
                props.data.map((el, ind)=>{
                    return(
                        <BreadcrumbItem key={el.name} className={classes.BreadCrumbItem}>
                            {
                                props.data.length===ind+1 ?
                                el.name
                                :
                                <Link to={el.link} >{el.name}</Link>
                            }
                        </BreadcrumbItem>
                    )
                })
            }
            </Breadcrumb>
        </div>
    );
};

export default BreadcrumbBody;