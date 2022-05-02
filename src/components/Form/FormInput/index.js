import React from 'react';

const FormInput = (props) => {
    return (
        <div className="form-group mt-2">
            <label>{props.label}</label>
            <input 
                type={props.type || 'text'} 
                className="form-control" 
                placeholder={props.placeholder} 
                value={props.value} 
                onChange={(ev)=>props.changeValue(ev.target.value)}
                disabled={props.disabled}
            />
        </div>
    );
};

export default FormInput;