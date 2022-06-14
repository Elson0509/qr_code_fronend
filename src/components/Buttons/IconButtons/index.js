import React from 'react';
import classes from './IconButtons.module.css'
import Icon from '../../Icon';

const IconButtons = (props) => {
    const size = props.size || 'lg'
    return (
        <div className={`col-12 text-center ${classes.DivButton}`}>
            {
                !!props.action1 &&
                <span onClick={() => props.action1()} className={`mx-4 ${classes.Icon}`}>
                    <Icon icon={props.icon1 || 'edit'} size={size} color={props.color1 || '#385165'} />
                </span>
            }
            {
                !!props.action2 &&
                <span onClick={() => props.action2()} className={`mx-4 ${classes.Icon}`}>
                    <Icon icon={props.icon2 || 'window-close'} size={size} color={props.color2 || 'red'} />
                </span>
            }
            {
                !!props.action3 &&
                <span onClick={() => props.action3()} style={{ backgroundColor: 'white', padding: 2, paddingHorizontal: 4 }} className={`mx-4 ${classes.Icon}`}>
                    <Icon icon={props.icon3 || 'qrcode'} size={size} color={props.color3 || 'black'} />
                </span>
            }

        </div>
    );
};

export default IconButtons;