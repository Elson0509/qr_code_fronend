import React from 'react';
import Icon from '../../Icon';

const ButtonIcon = (props) => {
    return (
        <button 
            type="button" 
            className={`btn my-2 ${!!props.newClass ? props.newClass : 'btn-success'}`} 
            onClick={props.clicked}>
            <Icon icon={props.icon} size={props.iconSize || '2x'} color={props.iconColor || 'white'} /> {props.text} 
        </button>
    );
};

export default ButtonIcon;