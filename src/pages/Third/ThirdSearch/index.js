import React, { useState, useEffect } from 'react';
import Body from '../../../layout/Body';
import { useAuth } from '../../../contexts/auth'
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import Plate from '../../../components/Plate'
import Image from '../../../components/Image'
import IconButtons from '../../../components/Buttons/IconButtons';
import ConfirmModal from '../../../components/Modals/ConfirmModal';
import MessageModal from '../../../components/Modals/MessageModal';
import GenericModal from '../../../components/Modals/GenericModal';
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import {
    Card, CardText, CardBody,
    CardTitle, CardSubtitle, CardHeader,
  } from 'reactstrap';
import QRCodeModal from '../../../components/Modals/QRCodeModal';

const ThirdSearch = (props) => {
    const {user} = useAuth()
    const [units, setUnits] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [qrCodemodal, setQrCodeModal] = useState(false)
    const [message, setMessage] = useState('')
    const [unitSelected, setUnitSelected] = useState(null)
    const [searchInput, setSearchinput] = useState('')
    const [entranceExitModal, setEntranceExitModal] = useState(false)
    const [modalEntrance, setModalEntrance] = useState(false)
    const [modalExit, setModalExit] = useState(false)
    const [modalMessage, setModalMessage] = useState(false)
    const [messageInfoModal, setMessageInfoModal] = useState('')
    const [messageErrorModal, setMessageErrorModal] = useState('')
    const [modalGeneric, setModalGeneric] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState(false)

    const breadcrumb=[
        {
            name: 'Painel Principal',
            link: '/'
        },
        {
            name: 'Listar Terceirizados',
            link: '/thirds/list'
        }
    ]

    let beginOfDay = new Date()
    beginOfDay.setHours(0)
    beginOfDay.setMinutes(0)
    beginOfDay.setSeconds(0)
    beginOfDay.setMilliseconds(0)

    useEffect(()=>{
        fetchUsers()
    }, [])

    const fetchUsers = _ => {
        api.get(`user/condo/${user.condo_id}/${Constants.USER_KIND["THIRD"]}`)
        .then(resp=>{
          setUnits(resp.data)
        })
        .catch(err=>{
          toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (TL1)', Constants.TOAST_CONFIG)
        })
        .finally(()=>{
          setLoading(false)
        })
    }

    const delUnitModal = unit => {
        setUnitSelected(unit)
        setMessage(`Excluir terceirizados e veículos do Bloco ${unit.bloco_name} unidade ${unit.number}?`)
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
            toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (TL2)', Constants.TOAST_CONFIG)
          })
          .finally(()=>{
            setLoading(false)
          })
    }

    const modalHandler = unit =>{
        setUnitSelected(unit)
        setQrCodeModal(true)
    }

    const editUnit = unit => {
        props.history.push('/thirds/edit',
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

    const carIconHandler = unit => {
        setUnitSelected(unit)
        //valid user?
        if(!(new Date(unit.residents[0].final_date) >= beginOfDay && new Date(unit.residents[0].initial_date) <= beginOfDay)){
            return toast.error('Terceirizados fora da data de autorização.', Constants.TOAST_CONFIG)
        }
        setEntranceExitModal(true)
    }

    const generateInfoUnits = _ =>{
        let unitsInfo = []
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

        if(searchInput){
            unitsInfo = unitsInfo.filter(el=>{
                return el.residents.some(res=>res.name.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1) ||
                    el.vehicles.some(vei=> vei.plate.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1) ||
                    el.residents.some(res=>res.company && res.company.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1) ||
                    el.bloco_name.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 ||
                    el.number.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 
            })
        }

        return unitsInfo
    }

    const exitHandler = _ => {
        setMessageInfoModal('')
        setMessageErrorModal('')
        setLoading(true)
        api.get(`reading/${unitSelected.id}/0`)
        .then(res=>{
            setLoading(false)
            let message = 'Confirmado. Terceirizados vão LIBERAR uma vaga de estacionamento? '
            setMessageInfoModal(message)
            setModalExit(true)
            setEntranceExitModal(false)
        })
        .catch(err=> {
            setLoading(false)
            setEntranceExitModal(false)
            toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (VS3)', Constants.TOAST_CONFIG)
        })
    }

    const entranceHandler = _ => {
        setMessageInfoModal('')
        setMessageErrorModal('')
        setLoading(true)
        api.get(`reading/${unitSelected.id}/1`)
        .then(res=>{
            setLoading(false)
            let message = 'Confirmado. '
            if(res.data.freeslots ===0){
                //there are not free slots
                message+='Mas não há vagas de estacionamento disponíveis.'
                setMessageErrorModal(message)
                setModalMessage(true)
            }
            else{
                //there are free slots
                message+= res.data.freeslots > 1 ? `Há ${res.data.freeslots} vagas livres. Terceirizados vão OCUPAR uma vaga?` : 'Há uma vaga livre. Terceirizados vão ocupar esta vaga?'
                setMessageInfoModal(message)
                setModalEntrance(true)
            }
            setEntranceExitModal(false)
        })
        .catch(err=> {
            setLoading(false)
            setEntranceExitModal(false)
            toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (VS2)', Constants.TOAST_CONFIG)
        })
    }

    const confirmSlotEntrance = _ => {
        setMessageInfoModal('')
        setMessageErrorModal('')
        setModalEntrance(false)
        setModalGeneric(true)
        setLoadingMessage(true)
        api.get(`condo/occupyslot`)
        .then(resp=>{
            const freeslots = resp.data.freeslots
            let message = resp.data.message + ' '
            if(freeslots > 0){
                message+= `Ainda ${freeslots > 1 ? `restam ${freeslots} vagas` : 'resta 1 vaga'}.`
            }
            else{
                message+= 'Não restam mais novas vagas.'
            }

            setMessageInfoModal(message)
        })
        .catch(err=>{
            setMessageErrorModal(err.response?.data?.message)
        })
        .finally(()=>{
            setLoadingMessage(false)
        })
    }
    
    const confirmSlotExit = _ => {
        setMessageInfoModal('')
        setMessageErrorModal('')
        setModalExit(false)
        setModalGeneric(true)
        setLoadingMessage(true)
        api.get(`condo/freeslot`)
        .then(resp=>{
            const freeslots = resp.data.freeslots
            const message = resp.data.message + ` Ainda ${freeslots > 1 ? `restam ${freeslots} vagas` : 'resta 1 vaga'}.`
            setMessageInfoModal(message)
        })
        .catch(err=>{
            setMessageErrorModal(err.response?.data?.message)
        })
        .finally(()=>{
            setLoadingMessage(false)
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
                <div className='col-12'>
                    <form>
                        <div className="form-group">
                            <label>Pesquisar</label>
                            <input type="email" className="form-control" placeholder="Nome, placa, empresa, bloco ou número" value={searchInput} onChange={(ev)=>setSearchinput(ev.target.value)}/>
                        </div>
                    </form>
                    {
                        generateInfoUnits().length === 0 && (
                            <div className="alert alert-danger my-4" role="alert">
                                Não há unidades que satisfazem a pesquisa
                            </div>
                        )
                    }
                </div>
                {
                    units.length>0 && (
                        generateInfoUnits().map(el=>{
                            if(el.residents.length === 0 && el.vehicles.length === 0)
                                return null

                            return (
                            <div className='col-lg-6 col-md-12 mb-4 p-2' key={el.id}>
                                <Card outline color="info">
                                    <CardHeader>
                                        <CardTitle tag="h4" className='text-center'>Bloco {el.bloco_name}</CardTitle>
                                        <CardSubtitle tag="h5" className="mb-2 text-muted text-center">Unidade {el.number}</CardSubtitle>
                                        {
                                            user.user_kind==Constants.USER_KIND['SUPERINTENDENT'] &&
                                            <IconButtons
                                                action1={()=>editUnit(el)}
                                                action2={()=>delUnitModal(el)}
                                                action3={()=>modalHandler(el)}
                                            />
                                        }
                                        {
                                            user.user_kind===Constants.USER_KIND['GUARD'] &&
                                            <IconButtons
                                                action1={()=>carIconHandler(el)}
                                                icon1='car-side'
                                            />
                                        }
                                    </CardHeader>
                                    <CardBody>
                                        <CardText tag='h6'>Terceirizados:</CardText>
                                        {
                                            el.residents.length === 0 && (
                                                <h6 className='h6 text-danger'>Sem Terceirizados cadastrados</h6>
                                            )
                                        }
                                        {
                                            !!el.residents.length && el.residents.map((resident, ind)=>(
                                                <div key={resident.id} style={{border: '1px solid #ddd', padding: '10px', display: 'flex', flexDirection: 'row', gap: '10px'}}>
                                                    <div style={{display: 'flex', justifyContent:'center'}}>
                                                        <Image id={resident.id} height={150}/>
                                                    </div>
                                                    <div>
                                                        {!!resident.name && <p className='p-0 m-0'><span className='enfase'>Nome:</span> {resident.name}</p>}
                                                        {!!resident.identification && <p className='p-0 m-0'><span className='enfase'>Id:</span> {resident.identification}</p>}
                                                        {!!resident.initial_date && <p className='p-0 m-0'><span className='enfase'>Início:</span> {Utils.printDate(new Date(resident.initial_date))}</p>}
                                                        {!!resident.final_date && <p className='p-0 m-0'><span className='enfase'>Fim:</span> {Utils.printDate(new Date(resident.final_date))}</p>}
                                                        {!!resident.company && <p className='p-0 m-0'><span className='enfase'>Empresa:</span> {resident.company}</p>}
                                                        {
                                                            new Date(resident.final_date) >= beginOfDay && new Date(resident.initial_date) <= beginOfDay ?
                                                            <p className='p-0 m-0'><span className='enfase'>Status:</span> Válido</p>
                                                            :
                                                            <p style={{fontWeight: 'bold', color: 'red'}}>Status: Expirado</p>
                                                        }
                                                    </div>
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
                                                <div key={vehicle.id} style={{borderBottom: ind === el.vehicles.length - 1 ? 'none' : '1px solid #ddd', paddingBottom: '10px'}}>
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
                        )})
                    )
                }
            </div>
            <ConfirmModal
                message={message}
                modal={modal}
                toggle={()=>setModal(false)}
                title='Apagar terceirizados'
                action1={()=>deleteUnitConfirmed()}
            />
            <ConfirmModal
                message={'Deseja registrar entrada ou saída de terceirizado?'}
                modal={entranceExitModal}
                toggle={()=>setEntranceExitModal(false)}
                title='Entrada/Saída'
                button1='ENTRADA'
                button2='SAÍDA'
                action1={()=>entranceHandler()}
                action2={()=>exitHandler()}
            />
            <ConfirmModal
                modal={modalEntrance}
                toggle={()=>setModalEntrance(false)}
                message={messageInfoModal}
                button1='Sim'
                button2='Não'
                action1={confirmSlotEntrance}
            />
            <ConfirmModal
                modal={modalExit}
                toggle={()=>setModalExit(false)}
                message={messageInfoModal}
                button1='Sim'
                button2='Não'
                action1={confirmSlotExit}
            />
            <MessageModal
                modal={modalMessage}
                toggle={()=>setModalMessage(false)}
                message={messageErrorModal}
            />
            <GenericModal
                modal={modalGeneric}
                toggle={()=>setModalGeneric(false)}
            >
                {loadingMessage &&
                    <Spinner color="primary" />
                    ||
                    <div>
                        {
                            !!messageInfoModal &&
                            <div className="alert alert-info text-center p-2" role="alert">
                                {messageInfoModal}
                            </div>
                        }
                        {
                            !!messageErrorModal &&
                            <div className="alert alert-danger text-center p-2" role="alert">
                                {messageErrorModal}
                            </div>
                        }
                        
                        <div className='text-center mb-4'>
                            
                        </div>
                        <div className='text-center'>
                            <button type="button" className="btn btn-primary p-2" onClick={()=>setModalGeneric(false)}>Entendido</button>
                        </div>
                    </div>
                }
            </GenericModal>
            {
                !!unitSelected &&
                <QRCodeModal
                    modal={qrCodemodal}
                    toggle={()=>setQrCodeModal(false)}
                    id={unitSelected.id}
                    info={`QR_Code Terceirizados ${unitSelected.bloco_name} ${unitSelected.number}`}
                />
            }
        </Body>
    );
};

export default ThirdSearch;