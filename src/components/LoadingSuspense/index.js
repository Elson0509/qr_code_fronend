import React from 'react';
import classes from './LoadingSuspense.module.css'

const LoadingSuspense = () => {
    return (
        <div className={classes.Wrapper}>
            <div className={classes.CubeWrapper}>
                <div className={classes.CubeFolding}>
                    <span className={classes.Leaf1}></span>
                    <span className={classes.Leaf2}></span>
                    <span className={classes.Leaf3}></span>
                    <span className={classes.Leaf4}></span>
                </div>
                <span className={classes.Loading} data-name="Loading">Carregando...</span>
            </div>
        </div>
    );
};

export default LoadingSuspense;