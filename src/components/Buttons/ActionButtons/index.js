import React from 'react';
import classes from './ActionButtons.module.css'

const ActionButtons = (props) => {
    return (
        <div className={`col-12 my-4 text-center ${classes.DivButton}`}>
            {props.errorMessage && 
                <div className="alert alert-danger text-center" role="alert">
                    {props.errorMessage}
                </div>
            }

            { !!props.textButton2 && <button type="button" onClick={()=>props.action2()} className="btn btn-danger mx-4 my-2">{props.textButton2}</button>}
            { !!props.textButton1 && <button type="button" onClick={()=>props.action1()} className="btn btn-success mx-4">{props.textButton1}</button>}
        </div>
    );
};

export default ActionButtons;