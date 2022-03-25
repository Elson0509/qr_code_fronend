import React, { useState, useEffect } from 'react';
import Body from '../../../layout/Body';
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import IconButtons from '../../../components/Buttons/IconButtons';
import ConfirmModal from '../../../components/Modals/ConfirmModal';
import ImageCloud from '../../../components/ImageCloud';
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import {
  Card, CardBody, CardHeader,
} from 'reactstrap';

const SindicoList = () => {
  const [sindicos, setSindicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState('')
  const [sindicoSelected, setSindicoSelected] = useState(null)

  const breadcrumb = [
    {
      name: 'Painel Principal',
      link: '/'
    },
    {
      name: 'Listar Administradores',
      link: '/sindico/list'
    }
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async _ => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    api.get(`user/adms`)
      .then(resp => {
        setSindicos(resp.data)
      })
      .catch(err => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (SL1)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const delSindicoModal = async user => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    setSindicoSelected(user)
    setMessage(`Excluir administrador ${user.name}?`)
    setModal(true)
  }

  const deleteSindicoConfirmed = _ => {
    setModal(false)
    setLoading(true)
    api.delete(`user/${sindicoSelected.id}`)
      .then(res => {
        toast.info(res.data.message, Constants.TOAST_CONFIG)
        fetchUsers()
      })
      .catch((err) => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (SL2)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (loading) {
    return (
      <Body breadcrumb={breadcrumb}>
        <Spinner color="primary" />
      </Body>
    )
  }

  return (
    <Body breadcrumb={breadcrumb}>
      <div className='row'>
        {
          sindicos.length > 0 && (
            sindicos.map(el => (
              <div className='col-lg-6 col-md-12 mb-4 p-2' key={el.id}>
                <Card outline color="info">
                  <CardHeader>
                    <IconButtons
                      //action1={()=>{console.log(el)}}
                      action2={() => { delSindicoModal(el) }}
                    />
                  </CardHeader>
                  <CardBody>
                    <div style={{ border: '1px solid #ddd', paddingBottom: '10px' }}>
                      {!!el.name && <p className='text-center pt-2 m-0 enfase'>{el.name}</p>}
                      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '15px' }}>
                        <ImageCloud id={el.photo_id} height={150} />
                      </div>
                      <div className='p-2'>
                        {!!el.Condo.name && <p className='p-0 m-0'><span className='enfase'>Condomínio:</span> {el.Condo.name}</p>}
                        {!!el.email && <p className='p-0 m-0'><span className='enfase'>Email:</span> {el.email}</p>}
                        {!!el.identification && <p className='p-0 m-0'><span className='enfase'>Id:</span> {el.identification}</p>}
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
        toggle={() => setModal(false)}
        title='Apagar sindicoa'
        action1={() => deleteSindicoConfirmed()}
      />
    </Body>
  );
};

export default SindicoList;