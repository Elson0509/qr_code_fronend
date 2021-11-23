import React, { useState, useEffect } from 'react';
import Body from '../../../layout/Body';
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import IconButtons from '../../../components/Buttons/IconButtons';
import ConfirmModal from '../../../components/Modals/ConfirmModal';
import Image from '../../../components/Image'
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import {
    Card, CardBody, CardHeader,
  } from 'reactstrap';
import ReplyModal from '../../../components/Modals/ReplyModal';

const EventList = () => {
    const [events, setEvents] = useState([])
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [replyMessage, setReplyMessage] = useState('')
    const [subject, setSubject] = useState('')
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [modalReply, setModalReply] = useState(false)
    const [message, setMessage] = useState('')

    const breadcrumb=[
        {
            name: 'Painel Principal',
            link: '/'
        },
        {
            name: 'Listar Eventos',
            link: '/events/list'
        }
    ]

    useEffect(()=>{
      fetchEvents()
    }, [])

    const fetchEvents = _ => {
      api.get(`occurrence`)
      .then(resp=>{
        setEvents(resp.data.occurences)
      })
      .catch(err=>{
        toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (EL1)', Constants.TOAST_CONFIG)
      })
      .finally(()=>{
        setLoading(false)
      })
    }

    const delEvent = on => {
      setMessage(`Confirma exclusão desta ocorrência?`)
      setSelectedEvent(on)
      setModal(true)
    }

    const deleteEventConfirmed = _ =>{
      setModal(false)
      setLoading(true)
      api.delete(`occurrence/${selectedEvent.id}`)
        .then(res=>{
          toast.info(res.data.message, Constants.TOAST_CONFIG)
          fetchEvents()
        })
        .catch((err)=>{
          toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (EL2)', Constants.TOAST_CONFIG)
        })
        .finally(()=>{
          setLoading(false)
        })
    }

    const replyHandler = item => {
      setSelectedEvent(item)
      setModalReply(true)
      setSubject('Re: ' + item.title)
      setReplyMessage('')
    }

    const sendHandler = _ => {
      api.post(`message`, {
        messageBody: replyMessage,
        subject,
        receiver: selectedEvent.userRegistering.id
      })
      .then(resp=>{
        setModalReply(false)
        toast.info(resp.data.message, Constants.TOAST_CONFIG)
      })
      .catch(err=>{
        toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CL3)', Constants.TOAST_CONFIG)
      })
      .finally(()=>{
        setLoading(false)
      })
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
        <div className='row'>
        {
          events.length>0 && (
            events.map(el=>(
              <div className='col-lg-6 col-md-12 mb-4 p-2' key={el.id}>
                <Card outline color="info">
                  <CardHeader>
                    <IconButtons
                      action2={()=>{delEvent(el)}}
                      action3={()=>{replyHandler(el)}}
                      icon3='reply'
                      color3='#2336F9'
                    />
                  </CardHeader>
                  <CardBody>
                    <div style={{border: '1px solid #ddd', paddingBottom: '10px'}}>
                      <div style={{display: 'flex', justifyContent:'center', paddingTop: '15px'}}>
                        <Image id={el.id} height={150}/>
                      </div>
                      <div className='p-2'>
                        {!!el.title && <p className='pt-2 m-0'><span className='enfase'>Assunto:</span> {el.title}</p>}
                        {!!el.created_at && <p className='pt-2 m-0'><span className='enfase'>Data:</span> {Utils.printDateAndHour(new Date(el.created_at))}</p>}
                        {!!el.place && <p className='pt-2 m-0'><span className='enfase'>Local:</span> {el.place}</p>}
                        {!!el.userRegistering.name && <p className='pt-2 m-0'><span className='enfase'>Quem registrou:</span> {el.userRegistering.name} ({Constants.USER_KIND_NAME[el.userRegistering.user_kind_id]})</p>}
                        {!!el.description && <p className='pt-2 m-0'><span className='enfase'>Descrição:</span> {el.description}</p>}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))
          )
        }
        </div>
        <ConfirmModal
          message={message}
          modal={modal}
          toggle={()=>setModal(false)}
          title='Apagar Evento'
          action1={()=>{deleteEventConfirmed()}}
        />
        <ReplyModal
          modal={modalReply}
          toggle={()=>setModalReply(false)}
          subject={subject}
          setSubject={setSubject}
          reply={replyMessage}
          setReply={setReplyMessage}
          replyHandler={()=>sendHandler()}
        />
      </Body>
    );
};

export default EventList;