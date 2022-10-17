import React, { useState, useEffect } from 'react';
import Body from '../../../layout/Body';
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import IconButtons from '../../../components/Buttons/IconButtons';
import ConfirmModal from '../../../components/Modals/ConfirmModal';
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import {
  Card, CardBody,
  CardHeader, CardFooter
} from 'reactstrap';

const CondoList = (props) => {
  const [condos, setCondos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [selectedCondo, setSelectedCondo] = useState(null)

  const breadcrumb = [
    {
      name: 'Painel Principal',
      link: '/'
    },
    {
      name: 'Listar Condomínios',
      link: '/condo/list'
    }
  ]

  useEffect(() => {
    fetchCondos()
  }, [])

  const fetchCondos = async _ => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    api.get(`condo`)
      .then(resp => {
        setCondos(resp.data)
      })
      .catch(err => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CoL1)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const delCondo = async on => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    setSelectedCondo(on)
    setModal(true)
  }

  const deleteCondoConfirmed = _ => {
    setModal(false)
    setLoading(true)
    api.delete(`condo/${selectedCondo.id}`)
      .then(res => {
        toast.info(res.data.message || 'Condomínio apagado com sucesso.', Constants.TOAST_CONFIG)
        fetchCondos()
      })
      .catch((err) => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CoL2)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const editHandler = condo => {

    props.history.push('/condo/edit',
      {
        condoBeingAdded: {
          address: condo.address,
          city: condo.city,
          freeslots: condo.freeslots,
          guard_can_messages: condo.guard_can_messages,
          guard_can_thirds: condo.guard_can_thirds,
          guard_can_visitors: condo.guard_can_visitors,
          id: condo.id,
          name: condo.name,
          photo_id: condo.photo_id,
          resident_can_messages: condo.resident_can_messages,
          resident_can_ocorrences: condo.resident_can_ocorrences,
          resident_can_thirds: condo.resident_can_thirds,
          resident_can_visitors: condo.resident_can_visitors,
          guard_see_phone: condo.guard_see_phone,
          guard_see_dob: condo.guard_see_dob,
          resident_has_dob: condo.resident_has_dob,
          resident_has_owner_field: condo.resident_has_owner_field,
          resident_has_phone: condo.resident_has_phone,
          slots: condo.slots,
          state: condo.state,
          condo_has_mail: condo.condo_has_mail,
          condo_has_classifieds: condo.condo_has_classifieds,
          condo_has_guard_routes: condo.condo_has_guard_routes,
          condo_has_news: condo.condo_has_news,
          condo_has_reservations: condo.condo_has_reservations,
        },
      }
    )
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
          condos.length > 0 && (
            condos.map(el => (
              <div className='col-lg-6 col-md-12 mb-4' key={el.id}>
                <Card outline color="info">
                  <CardHeader>
                    <IconButtons
                      action1={() => { editHandler(el) }}
                      action2={() => { delCondo(el) }}
                    />
                  </CardHeader>
                  <CardBody>
                    {!!el.name && <p className='p-0 m-0'><span className='enfase'> Nome: </span> {el.name}</p>}
                    {!!el.city && <p className='p-0 m-0'><span className='enfase'> Endereço: </span> {el.address}, {el.city} - {el.state}</p>}
                    <p className='p-0 m-0'><span className='enfase'> Vagas de estacionamento: </span>{el.slots}</p>
                    {!!el.createdAt && <p className='p-0 m-0'><span className='enfase'> Ativo desde </span> {Utils.printDate(new Date(el.createdAt))}</p>}
                    {
                      !!el.Partner && <p className='p-0 m-0'><span className='enfase'> Parceria: </span> {el.Partner.name}</p>
                    }
                  </CardBody>
                  <CardFooter>
                    <p className='p-0 m-0 text-center'><span className='enfase'>Colaboradores</span></p>
                    <p className='p-0 m-0'><span className='enfase'>Podem receber mensagens?</span> {el.guard_can_messages ? ' Sim' : ' Não'}</p>
                    <p className='p-0 m-0'><span className='enfase'>Podem cadastrar terceirizados?</span> {el.guard_can_thirds ? ' Sim' : ' Não'}</p>
                    <p className='p-0 m-0'><span className='enfase'>Podem cadastrar visitantes?</span> {el.guard_can_visitors ? ' Sim' : ' Não'}</p>
                    <p className='p-0 m-0'><span className='enfase'>Podem ver telefone de moradores?</span> {el.guard_see_phone ? ' Sim' : ' Não'}</p>
                    <p className='p-0 m-0'><span className='enfase'>Podem ver nascimento de moradores?</span> {el.guard_see_dob ? ' Sim' : ' Não'}</p>
                    <hr />
                    <p className='p-0 m-0 text-center'><span className='enfase'>Residentes</span></p>
                    <p className='p-0 m-0'><span className='enfase'>Podem receber mensagens?</span> {el.resident_can_messages ? ' Sim' : ' Não'}</p>
                    <p className='p-0 m-0'><span className='enfase'>Podem cadastrar terceirizados?</span> {el.resident_can_thirds ? ' Sim' : ' Não'}</p>
                    <p className='p-0 m-0'><span className='enfase'>Podem cadastrar visitantes?</span> {el.resident_can_visitors ? ' Sim' : ' Não'}</p>
                    <p className='p-0 m-0'><span className='enfase'>Podem registrar ocorrências?</span> {el.resident_can_ocorrences ? ' Sim' : ' Não'}</p>
                    <p className='p-0 m-0'><span className='enfase'>Possuem campo de alugado/dono?</span> {el.resident_has_owner_field ? ' Sim' : ' Não'}</p>
                    <p className='p-0 m-0'><span className='enfase'>Possuem telefone?</span> {el.resident_has_phone ? ' Sim' : ' Não'}</p>
                    <p className='p-0 m-0'><span className='enfase'>Possuem data de nascimento?</span> {el.resident_has_dob ? ' Sim' : ' Não'}</p>
                    <hr />
                    {
                      console.log(el)
                    }
                    <p className='p-0 m-0 text-center'><span className='enfase'>Condomínio</span></p>
                    <p className='p-0 m-0'><span className='enfase'>Possui controle de correspondência?</span> {el.condo_has_mail ? ' Sim' : ' Não'}</p>
                    <p className='p-0 m-0'><span className='enfase'>Possui classificados?</span> {el.condo_has_classifieds ? ' Sim' : ' Não'}</p>
                    <p className='p-0 m-0'><span className='enfase'>Possui ronda de vigilantes?</span> {el.condo_has_guard_routes ? ' Sim' : ' Não'}</p>
                    <p className='p-0 m-0'><span className='enfase'>Possui avisos? </span> {el.condo_has_news ? ' Sim' : ' Não'}</p>
                    <p className='p-0 m-0'><span className='enfase'>Possui reservas?</span> {el.condo_has_reservations ? ' Sim' : ' Não'}</p>
                  </CardFooter>
                </Card>
              </div>
            ))
          )
        }
        {
          condos.length === 0 && (
            <h3 className='h3 text-center'>Não há condomínios cadastrados</h3>
          )
        }
      </div>
      <ConfirmModal
        message={'Tem certeza que quer excluir este condomínio?'}
        modal={modal}
        toggle={() => setModal(false)}
        title='Apagar Condomínio?'
        action1={() => deleteCondoConfirmed()}
      />
    </Body>
  );
};

export default CondoList;