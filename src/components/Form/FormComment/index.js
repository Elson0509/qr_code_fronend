import React from 'react';
import * as Constants from '../../../services/constants'

const FormComment = (props) => {
    const maxValue = props.max || Constants.MAX_COMMENT_SIZE
    const changeHandler = value => {
        if(value.length <= maxValue)
            props.changeValue(value)
    }

    return (
        <div className="form-group mt-2">
            <label>{props.label}</label>
            <textarea
                rows={props.columns || 4} 
                type={props.type || 'text'} 
                className="form-control" 
                placeholder={props.placeholder} 
                value={props.value} 
                onChange={(ev)=>changeHandler(ev.target.value)}
            />
            <h6 className='h6 py-2 text-end'>{maxValue-props.value.length}/{maxValue}</h6>
        </div>
    );
};

export default FormComment;