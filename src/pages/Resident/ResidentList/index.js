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

const ResidentList = (props) => {
    const {user} = useAuth()
    const [units, setUnits] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [message, setMessage] = useState('')
    const [unitSelected, setUnitSelected] = useState(null)


    const breadcrumb=[
        {
            name: 'Dashboard',
            link: '/'
        },
        {
            name: 'Listar Moradores',
            link: '/residents/list'
        }
    ]

    useEffect(()=>{
        fetchUsers()
    }, [])

    const fetchUsers = _ => {
        api.get(`user/condo/${user.condo_id}/${Constants.USER_KIND["RESIDENT"]}`)
        .then(resp=>{
          setUnits(resp.data)
        })
        .catch(err=>{
          toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RL1)', Constants.TOAST_CONFIG)
        })
        .finally(()=>{
          setLoading(false)
        })
    }

    const delUnitModal = unit => {
        setUnitSelected(unit)
        setMessage(`Excluir moradores e veículos do Bloco ${unit.bloco_name} unidade ${unit.number}?`)
        setModal(true)
    }
  
    const deleteUnitConfirmed = _ =>{
        setModal(false)
        setLoading(true)
        api.delete(`user/unit/${unitSelected.id}`,{
          data:{
            user_id_last_modify: user.id,
          }
        })
          .then(res=>{
            toast.info(res.data.message, Constants.TOAST_CONFIG)
            fetchUsers()
          })
          .catch((err)=>{
            toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RL2)', Constants.TOAST_CONFIG)
          })
          .finally(()=>{
            setLoading(false)
          })
    }

    const editHandler = unit => {
        props.history.push('/residents/edit', 
          {
            selectedBloco: {
              id: unit.bloco_id,
              name: unit.bloco_name
            },
            selectedUnit:{
              id: unit.id,
              number: unit.number
            },
            residents: unit.residents,
            vehicles: unit.vehicles,
          }
        )
    }

    const generateInfoUnits = _ =>{
        const unitsInfo = []
        units.forEach(bloco=>{
          bloco.Units.forEach(unit => {
            const unitInfo = {}
            unitInfo.bloco_id = bloco.id
            unitInfo.bloco_name = bloco.name
            unitInfo.residents = unit.Users
            unitInfo.vehicles = unit.Vehicles
            unitInfo.number = unit.number
            unitInfo.id = unit.id
            unitsInfo.push(unitInfo)
          })
        })
        return unitsInfo
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
                        units.length>0 && (
                            generateInfoUnits().map(el=>(
                                <div className='col-lg-6 col-md-12 mb-4 p-2'>
                                    <Card outline color="info">
                                        <CardHeader>
                                            <CardTitle tag="h4" className='text-center'>Bloco {el.bloco_name}</CardTitle>
                                            <CardSubtitle tag="h5" className="mb-2 text-muted text-center">Unidade {el.number}</CardSubtitle>
                                            {
                                              user.user_kind==Constants.USER_KIND['SUPERINTENDENT'] &&
                                              <IconButtons
                                                  action1={()=>editHandler(el)}
                                                  action2={()=>delUnitModal(el)}
                                              />
                                            }
                                        </CardHeader>
                                        <CardBody>
                                            <CardText tag='h6'>Moradores:</CardText>
                                            {
                                                el.residents.length === 0 && (
                                                    <h6 className='h6 text-danger'>Sem moradores cadastrados</h6>
                                                )
                                            }
                                            {
                                                !!el.residents.length && el.residents.map((resident, ind)=>(
                                                    <div style={{border: '1px solid #ddd', paddingBottom: '10px'}}>
                                                        <div style={{display: 'flex', justifyContent:'center', paddingTop: '15px'}}>
                                                            <Image id={resident.id} height={150}/>
                                                        </div>
                                                        <p className='text-center p-0 m-0'>{resident.name}</p>
                                                        <p className='text-center p-0 m-0'>{resident.email}</p>
                                                    </div>
                                                ))
                                            }
                                        </CardBody>
                                        <CardBody>
                                            <CardText tag='h6' style={{borderTop: '3px solid #ddd', paddingTop: '10px'}}>Veículos Cadastrados:</CardText>
                                            {
                                                el.vehicles.length === 0 && (
                                                    <h6 className='h6 text-danger'>Sem veículos cadastrados</h6>
                                                )
                                            }
                                            {
                                                !!el.vehicles.length && el.vehicles.map((vehicle, ind)=> (
                                                  <div style={{borderBottom: ind === el.vehicles.length - 1 ? 'none' : '1px solid #ddd', paddingBottom: '10px'}}>
                                                    <p className='text-center'>{vehicle.maker} {vehicle.model} {vehicle.color}</p>
                                                    <div style={{display: 'flex', justifyContent:'center'}}>
                                                      <Plate plate={vehicle.plate}/>
                                                    </div>
                                                  </div>
                                                ))
                                            }
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
                title='Apagar moradores'
                action1={()=>deleteUnitConfirmed()}
            />
        </Body>
    );
};

export default ResidentList;