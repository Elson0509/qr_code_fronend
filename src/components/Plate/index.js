import React from 'react';
import * as Utils from '../../services/util'
import classes from './plate.module.css'
import mercosulImg from '../../Images/mercosul_logo_plate.jpg'
import brazilImg from '../../Images/brazil_logo_plate.jpg'

const Plate = (props) => {
    const plate = props.plate.toUpperCase()
    const isNewModel = Utils.isBrazilLicensePlateNewModel(plate)

    return (
        isNewModel ?
        <div className={classes.NewPlatediv}>
            <div className={classes.NewPlateHeader}>
                <img src={mercosulImg} className={classes.PlateImages}/>
                <span className={classes.NewPlateCountry}>Brasil</span>
                <img src={brazilImg} className={classes.PlateImages}/>
            </div>
            <span className={classes.OldPlateText}>{plate}</span>
        </div>
        :
        <div className={classes.OldPlatediv}>
            <span className={classes.OldPlateTextState}>UF - Município</span>
            <span className={classes.OldPlateText}>{Utils.oldModelPlateFormat(plate)}</span>
        </div>
    );
};

export default Plate;