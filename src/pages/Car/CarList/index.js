import React, { useState, useEffect } from 'react';
import Body from '../../../layout/Body';
import { useAuth } from '../../../contexts/auth'
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import Icon from '../../../components/Icon';
import IconButtons from '../../../components/Buttons/IconButtons';
import ConfirmModal from '../../../components/Modals/ConfirmModal';
import Plate from '../../../components/Plate'
import Image from '../../../components/Image'
import ImageModal from '../../../components/Modals/ImageModal';
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import {
    Card, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle, CardHeader,
  } from 'reactstrap';
import ReplyModal from '../../../components/Modals/ReplyModal';

const CarList = (props) => {
    const {user} = useAuth()
    const [overnights, setOvernights] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [modalReply, setModalReply] = useState(false)
    const [message, setMessage] = useState('')
    const [selectedOvernight, setSelectedOvernight] = useState(null)
    const [isModalPhotoActive, setIsModalPhotoActive] = useState(false)
    const [replyMessage, setReplyMessage] = useState('')
    const [subject, setSubject] = useState('')

    const breadcrumb=[
        {
            name: 'Painel Principal',
            link: '/'
        },
        {
            name: 'Listar Veículos',
            link: '/car/list'
        }
    ]

    useEffect(()=>{
      fetchOvernights()
    }, [])

    const fetchOvernights = _ => {
      api.get(`overnight`)
      .then(resp=>{
        setOvernights(resp.data.overnights)
      })
      .catch(err=>{
        toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CL1)', Constants.TOAST_CONFIG)
      })
      .finally(()=>{
        setLoading(false)
      })
    }

    const delOvernight = on => {
      setMessage(`Excluir este reporte de pernoite?`)
      setSelectedOvernight(on)
      setModal(true)
    }

    const deleteOvernightConfirmed = _ =>{
      setModal(false)
      setLoading(true)
      api.delete(`overnight/${selectedOvernight.id}`)
        .then(res=>{
          toast.info(res.data.message, Constants.TOAST_CONFIG)
          fetchOvernights()
        })
        .catch((err)=>{
          toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CL2)', Constants.TOAST_CONFIG)
        })
        .finally(()=>{
          setLoading(false)
        })
    }

    const onClickPhotoHandler = item => {
      setSelectedOvernight(item)
      setIsModalPhotoActive(true)
    }

    const replyHandler = item => {
      setSelectedOvernight(item)
      setModalReply(true)
      setSubject('')
      setReplyMessage('')
    }

    const sendHandler = _ => {
      api.post(`message/`, {
        messageBody: replyMessage,
        subject,
        receiver: selectedOvernight.userRegistering.id
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
          overnights.length>0 && (
            overnights.map(el=>(
              <div className='col-lg-6 col-md-12 mb-4 p-2' key={el.id}>
                <Card outline color="info">
                  <CardHeader>
                    <IconButtons
                      action2={()=>{delOvernight(el)}}
                      action3={()=>{replyHandler(el)}}
                      icon3='reply'
                      color3='#2336F9'
                    />
                  </CardHeader>
                  <CardBody>
                    <div style={{border: '1px solid #ddd', paddingBottom: '10px'}}>
                      <div style={{display: 'flex', justifyContent:'center', paddingTop: '15px', cursor: 'pointer'}} onClick={()=>onClickPhotoHandler(el)} >
                        <Image id={el.id} height={150}/>
                      </div>
                      <div className='p-2'>
                        {!!el.created_at && <p className='pt-2 m-0'><span className='enfase'>Data:</span> {Utils.printDateAndHour(new Date(el.created_at))}</p>}
                        <p className='pt-2 m-0'><span className='enfase'>Veículo registrado:</span> {el.is_registered_vehicle ? 'Sim' : 'Não'}</p>
                        {!!el.userRegistering.name && <p className='pt-2 m-0'><span className='enfase'>Quem registrou:</span> {el.userRegistering.name} ({Constants.USER_KIND_NAME[el.userRegistering.user_kind_id]})</p>}
                        {!!el.description && <p className='pt-2 m-0'><span className='enfase'>Descrição:</span> {el.description}</p>}
                        {!el.description && <p className='pt-2 m-0'><span className='enfase'>Sem descrição.</span></p>}
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
          action1={()=>{deleteOvernightConfirmed()}}
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
        {isModalPhotoActive &&
          <ImageModal
            modal={isModalPhotoActive}
            toggle={()=>setIsModalPhotoActive(false)}
            id={selectedOvernight.id}
          />
        }
      </Body>
    );
};

export default CarList;