import React from 'react';
import classes from './IconButtons.module.css'
import Icon from '../../Icon';

const IconButtons = (props) => {
    const size = '1x'
    return (
        <div className={`col-12 text-center ${classes.DivButton}`}>
            { 
                !!props.action1 && 
                <span onClick={()=>props.action1()} className={`mx-4 ${classes.Icon}`}>
                        <Icon icon='edit' size={size} color='#385165'/>
                </span>
            }
            { 
                !!props.action2 && 
                <span onClick={()=>props.action2()} className={`mx-4 ${classes.Icon}`}>
                        <Icon icon='window-close' size={size} color='red'/>
                </span>
            }
            { 
                !!props.action3 && 
                <span onClick={()=>props.action3()} style={{backgroundColor:'white', padding: 2, paddingHorizontal: 4}} className={`mx-4 ${classes.Icon}`}>
                        <Icon icon='qrcode' size={size} color='black'/>
                </span>
            }
            
        </div>
    );
};

export default IconButtons;