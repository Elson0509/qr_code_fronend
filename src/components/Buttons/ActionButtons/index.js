import React from 'react';
import classes from './ActionButtons.module.css'

const ActionButtons = (props) => {
    return (
        <div className={`col-12 my-4 text-center ${classes.DivButton}`}>
            { !!props.textButton1 && <button type="button" onClick={()=>props.action1()} className="btn btn-success mx-4">{props.textButton1}</button>}
            { !!props.textButton2 && <button type="button" onClick={()=>props.action2()} className="btn btn-danger mx-4">{props.textButton2}</button>}
        </div>
    );
};

export default ActionButtons;