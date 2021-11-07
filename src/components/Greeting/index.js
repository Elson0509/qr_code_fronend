import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import GeneralCard from '../GeneralCard';
import classes from './greeting.module.css'
import {saudacaoHorario, iconHour} from '../../services/util'
import Icon from '../Icon';
import api from '../../services/api'

const Greeting = (props) => {
    const [newMessagesQtt, setNewMessagesQtt] = useState(0)
    const history = useHistory();

    useEffect(()=>{
        fetchQttNewMessages()
    },[])

    const fetchQttNewMessages = _ => {
        api.get(`message/count/${props.user.id}`)
        .then(res=> {
            setNewMessagesQtt(res.data.count)
        })
        .catch((err)=> {
            console.log(err)
        })
    }

    return (
        <GeneralCard title='Dashboard'>
            <div className={classes.Row}>
                <p className={classes.Greeting}>
                    <span className={classes.GreetingIcon}>
                        <Icon icon={iconHour()}/> 
                    </span>
                    <span>
                        {`${saudacaoHorario(props.user.name)}!`}
                    </span>
                </p>
                <button type="button" className="btn btn-secondary" onClick={()=>history.push('message/list')}>
                    <Icon icon='envelope' color='white' size='lg'/> 
                    {newMessagesQtt > 0 ? <span className="badge badge-light">{newMessagesQtt}</span> : null}
                    <span className="sr-only">novas messages</span>
                </button>
            </div>
        </GeneralCard>
    );
};

export default Greeting;