import React from 'react';
import Icon from '../../Icon';

const ButtonIcon = (props) => {
    return (
        <button 
            type="button" 
            className={`btn btn-success my-2 ${props.newClass}`} 
            onClick={props.clicked}>
            <Icon icon={props.icon} size={props.iconSize || '2x'} color={props.iconColor || 'white'} /> {props.text} 
        </button>
    );
};

export default ButtonIcon;