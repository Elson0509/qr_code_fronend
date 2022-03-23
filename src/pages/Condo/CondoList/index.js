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
    CardHeader,
  } from 'reactstrap';

const CondoList = (props) => {
    const [condos, setCondos] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [selectedCondo, setSelectedCondo] = useState(null)

    const breadcrumb=[
        {
            name: 'Painel Principal',
            link: '/'
        },
        {
            name: 'Listar Condomínios',
            link: '/condo/list'
        }
    ]

    useEffect(()=>{
      fetchCondos()
    }, [])

    const fetchCondos = _ => {
      api.get(`condo`)
      .then(resp=>{
        setCondos(resp.data)
      })
      .catch(err=>{
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CoL1)', Constants.TOAST_CONFIG)
      })
      .finally(()=>{
        setLoading(false)
      })
    }

    const delCondo = on => {
      setSelectedCondo(on)
      setModal(true)
    }
  
    const deleteCondoConfirmed = _ =>{
      setModal(false)
      setLoading(true)
      api.delete(`condo/${selectedCondo.id}`)
        .then(res=>{
          toast.info(res.data.message || 'Condomínio apagado com sucesso.', Constants.TOAST_CONFIG)
          fetchCondos()
        })
        .catch((err)=>{
          Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CoL2)', Constants.TOAST_CONFIG)
        })
        .finally(()=>{
          setLoading(false)
        })
    }

    const editHandler = condo => {
      props.history.push('/condo/edit', 
        {
          condoBeingAdded: {
            id: condo.id,
            name: condo.name,
            address: condo.address,
            city: condo.city,
            state: condo.state,
            slots: condo.slots
          },
        }
      )
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
              condos.length>0 && (
                condos.map(el=>(
                  <div className='col-lg-6 col-md-12 mb-4' key={el.id}>
                    <Card outline color="info">
                      <CardHeader>
                        <IconButtons
                          action1={()=> {editHandler(el)}}
                          action2={()=> {delCondo(el)}}
                        />
                      </CardHeader>
                      <CardBody>
                        {!!el.name && <p className='p-0 m-0'><span className='enfase'> Nome: </span> {el.name}</p>}
                        {!!el.city && <p className='p-0 m-0'><span className='enfase'> Endereço: </span> {el.address}, {el.city} - {el.state}</p>}
                        <p className='p-0 m-0'><span className='enfase'> Vagas de estacionamento: </span>{el.slots}</p>
                        {!!el.createdAt && <p className='p-0 m-0'><span className='enfase'> Ativo desde </span> {Utils.printDate(new Date(el.createdAt))}</p>}
                      </CardBody>
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
              toggle={()=>setModal(false)}
              title='Apagar Condomínio?'
              action1={()=>deleteCondoConfirmed()}
          />
      </Body>
    );
};

export default CondoList;