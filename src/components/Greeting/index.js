import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { PREFIX_IMG_GOOGLE_CLOUD } from '../../services/constants'
import GeneralCard from '../GeneralCard';
import classes from './greeting.module.css'
import { saudacaoHorario, iconHour, canShowMessage } from '../../services/util'
import { useAuth } from '../../contexts/auth';
import Icon from '../Icon';
import api from '../../services/api'

const Greeting = () => {
  const [newMessagesQtt, setNewMessagesQtt] = useState(0)
  const history = useHistory();
  const { user } = useAuth()

  useEffect(() => {
    if (canShowMessage(user)) {
      api.get(`message/count/${user.id}`)
        .then(res => {
          setNewMessagesQtt(res.data.count)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [])

  return (
    <div className={classes.Container}>
      {
        !!user.condo?.photo_id &&
        <div className={classes.ImgCondo}>
          <img src={PREFIX_IMG_GOOGLE_CLOUD + user.condo.photo_id} alt='condo' height='100' />
        </div>
      }
      <GeneralCard title='Painel Principal' mb='mb-0'>
        <div className={classes.Row}>
          <div>
            <div className={classes.LeftSide}>
              {
                !!user.condo?.Partner &&
                <div className='bg-dark'>
                  <img src={PREFIX_IMG_GOOGLE_CLOUD + user.condo.Partner.photo_id} alt='partner' height={80} />
                </div>
              }
              <p className={classes.Greeting}>
                <span className={classes.GreetingIcon}>
                  <Icon icon={iconHour()} />
                </span>
                <span>
                  {`${saudacaoHorario(user.name)}!`}
                </span>
              </p>
            </div>
            { !!user.condo?.name &&
            <p className={classes.CondoName}>
              Condomínio {user.condo.name}
            </p>
            }
          </div>
          {
            canShowMessage(user) &&
            <button type="button" className="btn btn-secondary" onClick={() => history.push('message/list')}>
              <Icon icon='envelope' color='white' size='lg' />
              {newMessagesQtt > 0 ? <span className="badge badge-light">{newMessagesQtt}</span> : null}
              <span className="sr-only">novas messages</span>
            </button>
          }
        </div>
      </GeneralCard>
    </div>
  );
};

export default Greeting;