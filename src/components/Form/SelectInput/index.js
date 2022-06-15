import React from 'react';

const SelectInput = (props) => {
  return (
    <div className="form-group mt-2">
      <label>{props.label}</label>
      <select className="form-control" value={props.value} onChange={(ev) => props.changeValue(ev.target.value)}>
        {
          props.options.map((el, ind) => (
            <option key={ind} value={ind}>{el.name}</option>
          ))
        }
      </select>
    </div>
  );
};

export default SelectInput;