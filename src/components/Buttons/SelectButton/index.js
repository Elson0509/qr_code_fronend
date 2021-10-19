import React from 'react';
import Icon from '../../Icon';
import classes from './SelectButton.module.css'

const SelectButton = (props) => {
    return (
        <div className='row justify-content-center bg-primary p-2 text-dark bg-opacity-25 border border-primary border-2 rounded-3 m-2'>
            <div className='row justify-content-center'>
                <div className={`col-lg-4 col-md-5 col-sm-6 text-center ${classes.Button}`} onClick={props.action}>
                    <div>
                        <Icon icon={props.icon} size='2x' color='white'/>
                    </div>
                    <div>
                        {props.text}
                    </div>
                </div>
            </div>
            {
                props.children && 
                <div className='col-12 mt-4'>
                    {props.children}
                </div>
            }
        </div>
    );
};

export default SelectButton;