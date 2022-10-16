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

const GuardList = () => {
  const [guards, setGuards] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState('')
  const [guardSelected, setGuardSelected] = useState(null)

  const breadcrumb = [
    {
      name: 'Painel Principal',
      link: '/'
    },
    {
      name: 'Listar Colaboradores',
      link: '/guards/list'
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
    api.get(`user/kind/${Constants.USER_KIND["GUARD"]}`)
      .then(resp => {
        setGuards(resp.data)
      })
      .catch(err => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RL1)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const delGuardModal = async user => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    setGuardSelected(user)
    setMessage(`Excluir guarda ${user.name}?`)
    setModal(true)
  }

  const deleteGuardConfirmed = _ => {
    setModal(false)
    setLoading(true)
    api.delete(`user/${guardSelected.id}`)
      .then(res => {
        toast.info(res.data.message, Constants.TOAST_CONFIG)
        fetchUsers()
      })
      .catch((err) => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (GL2)', Constants.TOAST_CONFIG)
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
          guards.length > 0 && (
            guards.map(el => (
              <div className='col-lg-6 col-md-12 mb-4 p-2' key={el.id}>
                <Card outline color="info">
                  <CardHeader>
                    <IconButtons
                      action2={() => { delGuardModal(el) }}
                    />
                  </CardHeader>
                  <CardBody>
                    <div style={{ border: '1px solid #ddd', paddingBottom: '10px' }}>
                      {!!el.name && <p className='text-center pt-2 m-0 enfase'>{el.name}</p>}
                      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '15px' }}>
                        <ImageCloud id={el.photo_id} width={180} />
                      </div>
                      {!!el.email && <p className='text-center p-0 m-0'>{el.email}</p>}
                      {!!el.identification && <p className='text-center p-0 m-0'>Id: {el.identification}</p>}
                      {!!el.company && <p className='text-center p-0 m-0'>Empresa: {el.company}</p>}
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))
          )
        }
        {
          guards.length === 0 && (
            <h3 className='h3 text-center'>Não há colaboradores cadastrados</h3>
          )
        }
      </div>
      <ConfirmModal
        message={message}
        modal={modal}
        toggle={() => setModal(false)}
        title='Apagar Guarda'
        action1={() => deleteGuardConfirmed()}
      />
    </Body>
  );
};

export default GuardList;