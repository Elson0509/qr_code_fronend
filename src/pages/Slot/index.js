import React, { useState, useEffect } from 'react';
import Body from '../../layout/Body';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import SelectButton from '../../components/Buttons/SelectButton'
import api from '../../services/api'
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import {
    Card, CardBody, CardHeader,
  } from 'reactstrap';

const Slot = () => {
  const [loading, setLoading] = useState(true)
  const [freeSlots, setFreeSlots] = useState(0)
  const [totalSlots, setTotalSlots] = useState(0)

  const breadcrumb=[
      {
          name: 'Menu Principal',
          link: '/'
      },
      {
          name: 'Estacionamento',
          link: '/slot'
      }
  ]

  useEffect(()=>{
    fetchSlots()
  }, [])

  const fetchSlots = _ => {
    api.get(`condo/slots`)
    .then(resp=>{
      setFreeSlots(resp.data.freeslots)
      setTotalSlots(resp.data.totalslots)
    })
    .catch(err=>{
      Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (S1)', Constants.TOAST_CONFIG)
    })
    .finally(()=>{
      setLoading(false)
    })
  }

  const freeSlotHandler = _ => {
    if(freeSlots===totalSlots){
      toast.error('Todas as vagas já estão livres.', Constants.TOAST_CONFIG)
    }
    else{
      setLoading(true)
      api.get(`condo/freeslot`)
      .then(resp=>{
        setFreeSlots(resp.data.freeslots)
        setTotalSlots(resp.data.totalslots)
        toast.info('Vaga liberada.', Constants.TOAST_CONFIG)
      })
      .catch(err=>{
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (S2)', Constants.TOAST_CONFIG)
      })
      .finally(()=>{
        setLoading(false)
      })
    }
  }

  const occupySlotHandler = _ => {
    if(freeSlots===0){
      toast.error('Não há mais vagas.', Constants.TOAST_CONFIG)
    }
    else{
      setLoading(true)
      api.get(`condo/occupyslot`)
      .then(resp=>{
        setFreeSlots(resp.data.freeslots)
        setTotalSlots(resp.data.totalslots)
        toast.info('Vaga preenchida.', Constants.TOAST_CONFIG)
      })
      .catch(err=>{
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (S3)', Constants.TOAST_CONFIG)
      })
      .finally(()=>{
        setLoading(false)
      })
    }
  }
  
  if(loading){
    return (
      <Body breadcrumb={breadcrumb}>
        <Spinner color="primary"/>
      </Body>
    )
  }

  return (
    <Body breadcrumb={breadcrumb}>
        <Card outline color="info">
          <CardHeader className='text-center'>
            <p className='fs-3 m-0'>Há <span className='enfase'> {freeSlots} </span> vagas de estacionamento livres</p>
            <small className='fs-6'>de um total de {totalSlots} vagas.</small>
          </CardHeader>
          <CardBody>
            <div className='row'>
              <div className='col-lg-6 col-md-12'>
                <SelectButton
                  icon='car'
                  icon2='sign-in-alt'
                  text='Dar entrada'
                  action={()=>{occupySlotHandler()}}
                />
              </div>
              <div className='col-lg-6 col-md-12'>
                <SelectButton
                  icon='sign-out-alt'
                  icon2='car'
                  text='Dar saída'
                  action={()=>{freeSlotHandler()}}
                />
              </div>
            </div>
          </CardBody>
        </Card>
    </Body>
  );
};

export default Slot;