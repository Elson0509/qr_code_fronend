import React from 'react';

const SelectInput = (props) => {
    return (
        <div className="form-group mt-2">
            <label>{props.label}</label>
            <select className="form-control" value={props.value} onChange={(ev)=>props.changeValue(ev.target.value)}>
                {
                    props.options.map(el=>(
                        <option key={el.value} value={el.value}>{el.label}</option>
                    ))
                }
                
                
            </select>
        </div>
    );
};

export default SelectInput;