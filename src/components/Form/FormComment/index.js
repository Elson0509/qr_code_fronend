import React from 'react';
import * as Constants from '../../../services/constants'

const FormComment = (props) => {
    const changeHandler = value => {
        if(value.length <= Constants.MAX_COMMENT_SIZE)
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
            <h6 className='h6 py-2 text-end'>{Constants.MAX_COMMENT_SIZE-props.value.length}/{Constants.MAX_COMMENT_SIZE}</h6>
        </div>
    );
};

export default FormComment;