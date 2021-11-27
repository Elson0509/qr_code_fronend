import React, { useState } from 'react';
import Body from '../../layout/Body';
import * as Constants from '../../services/constants'
import QrReader from 'react-qr-reader'
import * as Utils from '../../services/util'
import api from '../../services/api'
import Plate from '../../components/Plate';
import Image from '../../components/Image';
import classes from './scan.module.css'
import { Spinner } from 'reactstrap';
import ConfirmModal from '../../components/Modals/ConfirmModal';
import GenericModal from '../../components/Modals/GenericModal';
import { toast } from 'react-toastify';

const MyQrCode = () => {
    const [errorMessage, setErrorMessage] = useState('')
    const [dataFetched, setDataFetched] = useState(null)
    const [userType, setUserType] = useState('')
    const [isScanning, setIsScanning] = useState(true)
    const [reading, setReading] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState(false)
    const [modalEntrance, setModalEntrance] = useState(false)
    const [modalExit, setModalExit] = useState(false)
    const [modalGeneric, setModalGeneric] = useState(false)
    const [messageInfoModal, setMessageInfoModal] = useState('')
    const [messageErrorModal, setMessageErrorModal] = useState('')
    const [disableButtons, setDisableButtons] = useState(false)

    const breadcrumb=[
        {
            name: 'Painel Principal',
            link: '/'
        },
        {
            name: 'Escanear',
            link: '/scan'
        }
    ]

    const messageError = 'Esse QR Code não é válido ou o usuário não está cadastrado.'

    const handleScan = data => {
        if(data){
            const prefix = data.substring(0, 4)
            if(prefix !== Constants.QR_CODE_PREFIX){
                return setErrorMessage(messageError)
            }
            const dataParts = data.split(':')
            if(dataParts.length!==2 || !Utils.isUUID(dataParts[1])){
                return setErrorMessage(messageError)
            }
            setLoading(true)
            api.get(`reading/${dataParts[1]}`)
            .then(res=>{
                console.log(res.data)
                setErrorMessage('')
                const found = res.data.userFound || res.data.unitFound
                setDataFetched(found)
                setReading(res.data.read)
                setIsScanning(false)
                if(found.user_kind_id === Constants.USER_KIND['RESIDENT']){
                    setUserType('Residente')
                }
                if(found.user_kind_id === Constants.USER_KIND['GUARD']){
                    setUserType('Colaborador')
                }
                if(found.user_kind_id === Constants.USER_KIND['SUPERINTENDENT']){
                    setUserType('Administrador')
                }
                if(found.unit_kind_id && found.unit_kind_id === Constants.USER_KIND['VISITOR']){
                    setUserType('Visitantes')
                }
                if(found.unit_kind_id && found.unit_kind_id === Constants.USER_KIND['THIRD']){
                    setUserType('Terceirizados')
                }
                
            })
            .catch(err=>{
                setErrorMessage(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (SC1)')
            })
            .finally(()=>{
                setLoading(false)
            })

        }
    }

    const rescanHandler = _ => {
        setErrorMessage('')
        setDataFetched('')
        setUserType('')
        setReading(null)
        setIsScanning(true)
        setLoading(false)
        setDisableButtons(false)
        setMessageInfoModal('')
        setMessageErrorModal('')
    }

    const handleError = err => {
        console.log(err)
    }

    const entranceHandler = _ => {
        setModalEntrance(true)
        setDisableButtons(true)
    }

    const exitHandler = _ => {
        setLoading(true)
        api.put(`reading/${reading.id}`)
        .then(resp=>{
            setDisableButtons(true)
            setLoading(false)
            setModalExit(true)
        })
        .catch(err=>{
            toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (SC3)', Constants.TOAST_CONFIG)
            setLoading(false)
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
                <Spinner color="primary" />
            </Body>
        )
    }

    return (
        <Body breadcrumb={breadcrumb}>
            <div className='row'>
                { isScanning &&
                    <div className='col-12 p-center mb-4'>
                        {
                            !!errorMessage &&
                            <div className="alert alert-danger mb-2" role="alert">
                                {errorMessage}
                            </div>
                        }
                        <h4 className='h4 mb-4'>Utilize o QR Code abaixo para se identificar</h4>
                        <div style={{width: '80%', margin: '0 auto', maxWidth: 500}}>
                            <QrReader
                                delay={300}
                                onError={handleError}
                                onScan={handleScan}
                            />
                        </div>
                    </div>
                }
                {!!dataFetched && dataFetched.user_kind_id &&
                    <div>
                        <h3 className='h3 text-center'>{userType}</h3>
                        <div className={classes.UserDataDiv}>
                            <div><Image id={dataFetched.id}/></div>
                            <div className={classes.UserInfoDiv}>
                                <p style={{marginTop: 8, fontSize: 18, fontWeight: 'bold'}}>{dataFetched.name}</p>
                                {!!dataFetched.Unit?.Bloco?.name && <p style={{marginTop: 4, fontSize: 18}}>{`Bloco ${dataFetched.Unit.Bloco.name}`} - {`Unidade ${dataFetched.Unit.number}`}</p>}
                                {!dataFetched.Unit?.Vehicles.length && <p style={{textDecorationLine: 'underline', fontSize: 15, textAlign: 'center'}}>Não há veículos cadastrados.</p>}
                                <div className={classes.VehiclesDiv}>
                                    {!!dataFetched.Unit?.Vehicles.length && <p style={{fontSize: 15}}>Veículos cadastrados:</p>}
                                    {!!dataFetched.Unit?.Vehicles.length && 
                                        dataFetched.Unit?.Vehicles.map((el, ind)=>{
                                            return (
                                                <div key={ind}>
                                                    <p style={{fontSize: 15, fontWeight: 'bold', marginBottom: 5}}>{`${el.maker} ${el.model} ${el.color}`}</p>
                                                    <Plate plate={el.plate}/>
                                                </div>
                                            )
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>

                }
                {!!dataFetched && dataFetched.unit_kind_id &&
                    <div>
                        <h3 className='h3 text-center'>{userType}</h3>
                        <h6 className='h6 text-center'>Autorizado por Bloco {dataFetched.Bloco.name} - Unidade {dataFetched.number}</h6>
                        {!!dataFetched.Users[0]?.final_date && <h6 className='h6 text-center'>Autorizado até {Utils.printDate(new Date(dataFetched.Users[0].final_date))}</h6>}
                        {
                            dataFetched.Users.map((el, ind)=>{
                                return(
                                    <div className={classes.UserDataDiv} key={ind}>
                                        <div><Image id={el.id}/></div>
                                        <div className={classes.UserInfoDiv}>
                                            {!!el.name && <p style={{marginTop: 4, fontSize: 18, fontWeight: 'bold'}}>{el.name}</p>}
                                            {!!el.company && <p style={{marginTop: 4, fontSize: 18}}>Empresa: {el.company}</p>}
                                            {!!el.identification && <p style={{marginTop: 4, fontSize: 18}}>{`Id: ${el.identification}`}</p>}
                                        </div>
                                    </div>
                                )
                            })
                        }
                        
                        <div style={{alignItems:'center', marginTop: 10}}>
                            {!dataFetched.Vehicles.length && <p style={{textDecorationLine: 'underline', fontSize: 15, textAlign: 'center'}}>Não há veículos cadastrados.</p>}
                            {!!dataFetched.Vehicles.length && <p style={{textAlign: 'center', fontSize: 22, fontWeight: 'bold', marginBottom: 0, letterSpacing: 1, textDecorationLine: 'underline'}}>Veículos cadastrados</p>}
                            {!!dataFetched.Vehicles.length && 
                                dataFetched.Vehicles.map((el, ind)=>{
                                    return (
                                        <div key={ind} style={{padding: 12}}>
                                            <p style={{textAlign: 'center', fontSize: 15, fontWeight: 'bold', marginBottom: 5}}>{`${el.maker} ${el.model} ${el.color}`}</p>
                                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                                <Plate plate={el.plate}/>
                                            </div>
                                        </div>
                                    )
                            })}
                        </div>
                        <div className={classes.ButtonsRegister}>
                            <button type="button" className="btn btn-success" disabled={disableButtons} onClick={()=>entranceHandler()}>Registrar ENTRADA</button>
                            <button type="button" className="btn btn-warning" disabled={disableButtons} onClick={()=>exitHandler()}>Registrar SAÍDA</button>
                        </div>
                    </div>
                }
                { !isScanning && <div className='col-12 my-4 text-center'>
                    <button type="button" className="btn btn-primary btn-lg" onClick={rescanHandler}>Reescanear</button>
                </div>}
            </div>
            <ConfirmModal
                modal={modalEntrance}
                toggle={()=>setModalEntrance(false)}
                message={`Confirmado. ${userType} vão UTILIZAR uma vaga de estacionamento?`}
                button1='Sim'
                button2='Não'
                action1={confirmSlotEntrance}
            />
            <ConfirmModal
                modal={modalExit}
                toggle={()=>setModalExit(false)}
                message={`Confirmado. ${userType} vão LIBERAR uma vaga de estacionamento?`}
                button1='Sim'
                button2='Não'
                action1={confirmSlotExit}
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
                            <button type="button" className="btn btn-primary p-2" onClick={()=>setModalGeneric(false)}>Entendi</button>
                        </div>
                    </div>
                }
            </GenericModal>
            
        </Body>
    );
};

export default MyQrCode;