import React from 'react';
import GeneralCard from '../GeneralCard';
import classes from './greeting.module.css'
import {saudacaoHorario, iconHour} from '../../services/util'
import Icon from '../Icon';

const Greeting = (props) => {
    return (
        <GeneralCard title='Dashboard'>
            <p className={classes.Greeting}>
                <span className={classes.GreetingIcon}>
                    <Icon icon={iconHour()}/> 
                </span>
                <span>
                    {`${saudacaoHorario(props.user.name)}!`}
                </span>
            </p>
        </GeneralCard>
    );
};

export default Greeting;