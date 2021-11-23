import React, { useState, useEffect } from 'react';
import Body from '../../../layout/Body';
import { useAuth } from '../../../contexts/auth'
import * as Constants from '../../../services/constants'
import api from '../../../services/api'
import Icon from '../../../components/Icon';
import IconButtons from '../../../components/Buttons/IconButtons';
import ConfirmModal from '../../../components/Modals/ConfirmModal';
import Plate from '../../../components/Plate'
import Image from '../../../components/Image'
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import {
    Card, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle, CardHeader,
  } from 'reactstrap';

const GuardList = (props) => {
    const {user} = useAuth()
    const [guards, setGuards] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [message, setMessage] = useState('')
    const [guardSelected, setGuardSelected] = useState(null)


    const breadcrumb=[
        {
            name: 'Painel Principal',
            link: '/'
        },
        {
            name: 'Listar Colaboradores',
            link: '/guards/list'
        }
    ]

    useEffect(()=>{
        fetchUsers()
    }, [])

    const fetchUsers = _ => {
        api.get(`user/kind/${Constants.USER_KIND["GUARD"]}`)
        .then(resp=>{
          setGuards(resp.data)
        })
        .catch(err=>{
          toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RL1)', Constants.TOAST_CONFIG)
        })
        .finally(()=>{
          setLoading(false)
        })
    }

    const delGuardModal = user => {
      setGuardSelected(user)
      setMessage(`Excluir guarda ${user.name}?`)
      setModal(true)
    }
  
    const deleteGuardConfirmed = _ =>{
      setModal(false)
      setLoading(true)
      api.delete(`user/${guardSelected.id}`)
        .then(res=>{
          toast.info(res.data.message, Constants.TOAST_CONFIG)
          fetchUsers()
        })
        .catch((err)=>{
          toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (GL2)', Constants.TOAST_CONFIG)
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
              guards.length>0 && (
                guards.map(el=>(
                    <div className='col-lg-6 col-md-12 mb-4 p-2' key={el.id}>
                        <Card outline color="info">
                            <CardHeader>
                                <IconButtons
                                    action2={()=>{delGuardModal(el)}}
                                />
                            </CardHeader>
                            <CardBody>
                              <div style={{border: '1px solid #ddd', paddingBottom: '10px'}}>
                                {!!el.name && <p className='text-center pt-2 m-0 enfase'>{el.name}</p>}
                                <div style={{display: 'flex', justifyContent:'center', paddingTop: '15px'}}>
                                    <Image id={el.id} height={150}/>
                                </div>
                                {!!el.email && <p className='text-center p-0 m-0'>{el.email}</p>}
                                {!!el.identification && <p className='text-center p-0 m-0'>Id: {el.identification}</p>}
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
              title='Apagar Guarda'
              action1={()=>deleteGuardConfirmed()}
          />
      </Body>
    );
};

export default GuardList;