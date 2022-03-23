import React, { useState, useEffect } from 'react';
import Body from '../../../layout/Body';
import { useAuth } from '../../../contexts/auth'
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import Icon from '../../../components/Icon';
import ConfirmModal from '../../../components/Modals/ConfirmModal';
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import {
    Card, CardBody, 
    Button, Modal, ModalHeader, ModalBody, ModalFooter
  } from 'reactstrap';

const MessageList = (props) => {
    const {user} = useAuth()
    const [messages, setMessages] = useState([])
    const [selectedMessage, setSelectedMessage] = useState({})
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [modalViewMessage, setModalViewMessage] = useState(false)

    const breadcrumb=[
        {
            name: 'Painel Principal',
            link: '/'
        },
        {
            name: 'Mensagens',
            link: '/messages/list'
        }
    ]

    useEffect(()=>{
      fetchMessages()
    }, [])

    const fetchMessages = _ => {
      api.get(`message/list/${user.id}`)
      .then(resp=>{
        setMessages(resp.data.messages)
      })
      .catch(err=>{
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (ML1)', Constants.TOAST_CONFIG)
      })
      .finally(()=>{
        setLoading(false)
      })
    }

    const delMessage = on => {
      setSelectedMessage(on)
      setModal(true)
    }
  
    const deleteMessageConfirmed = _ =>{
      setModal(false)
      setLoading(true)
      api.delete(`message/${selectedMessage.id}`)
        .then(res=>{
          toast.info(res.data.message, Constants.TOAST_CONFIG)
          fetchMessages()
        })
        .catch((err)=>{
          Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (ML2)', Constants.TOAST_CONFIG)
        })
        .finally(()=>{
          setLoading(false)
        })
    }

    const viewMessageHandler = itemMessage => {
      setSelectedMessage(itemMessage)
      if(!itemMessage.is_read)
        api.put(`/message/${itemMessage.id}`)
      setModalViewMessage(true)
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
              messages.length>0 && (
                messages.map(el=>(
                  <div className='col-12 pb-3' key={el.id}>
                      <Card color="light">
                        <CardBody>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} onClick={()=>viewMessageHandler(el)}>
                            <div style={{cursor: 'pointer', width: '100%'}}>
                              <p style={{fontSize: 15, margin: 0,  fontWeight: !el.is_read ? 'bold' : 'normal'}}>{el.subject} ({Utils.printDateAndHour(new Date(el.created_at))})</p>
                            </div>
                            <span onClick={()=>delMessage(el)} className={`mx-4`} style={{cursor: 'pointer'}}>
                              <Icon icon={'window-close'} color={'red'}/>
                            </span>
                          </div>
                        </CardBody>
                      </Card>
                  </div>
                ))
              )
            }
          </div>
          <ConfirmModal
              message={'Excluir esta mensagem?'}
              modal={modal}
              toggle={()=>setModal(false)}
              title='Confirme'
              action1={()=>deleteMessageConfirmed()}
          />
          <Modal isOpen={modalViewMessage} toggle={()=>setModalViewMessage(false)} className={props.className}>
            <ModalHeader toggle={()=>setModalViewMessage(false)}>Mensagem</ModalHeader>
            <ModalBody>
            {!!selectedMessage.sending?.name && <p><span className='enfase'>De:</span> {selectedMessage.sending?.name} ({Constants.USER_KIND_NAME[selectedMessage.sending.user_kind_id]})</p>}
              <p><span className='enfase'>Assunto:</span> {selectedMessage.subject}</p>
              <p style={{marginTop: 5}}><span className='enfase'>Mensagem:</span> {selectedMessage.message}</p>
            </ModalBody>
            <ModalFooter>
                <Button color="success" onClick={()=>setModalViewMessage(false)}>{'Fechar'}</Button>
            </ModalFooter>
          </Modal>
      </Body>
    );
};

export default MessageList;