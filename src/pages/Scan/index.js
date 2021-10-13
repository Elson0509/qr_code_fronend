import React, { useState } from 'react';
import Body from '../../layout/Body';
import { useAuth } from '../../contexts/auth'
import * as Constants from '../../services/constants'
import QrReader from 'react-qr-reader'
import * as Utils from '../../services/util'
import api from '../../services/api'
import Plate from '../../components/Plate';
import Image from '../../components/Image';
import classes from './scan.module.css'
import { Spinner } from 'reactstrap';

const MyQrCode = (props) => {
    const {user} = useAuth()
    const [errorMessage, setErrorMessage] = useState('')
    const [dataFetched, setDataFetched] = useState(null)
    const [userType, setUserType] = useState('')
    const [isScanning, setIsScanning] = useState(true)
    const [loading, setLoading] = useState(false)

    const breadcrumb=[
        {
            name: 'Dashboard',
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
            if(prefix != Constants.QR_CODE_PREFIX){
                return setErrorMessage(messageError)
            }
            const dataParts = data.split(':')
            if(dataParts.length!=2 || !Utils.isUUID(dataParts[1])){
                return setErrorMessage(messageError)
            }
            setLoading(true)
            api.get(`reading/${dataParts[1]}`)
            .then(res=>{
                setErrorMessage('')
                setDataFetched(res.data)
                setIsScanning(false)
                if(res.data.user_kind_id == Constants.USER_KIND['RESIDENT']){
                    setUserType('Residente')
                }
                if(res.data.user_kind_id == Constants.USER_KIND['GUARD']){
                    setUserType('Vigilante')
                }
                if(res.data.user_kind_id == Constants.USER_KIND['SUPERINTENDENT']){
                    setUserType('Administrador')
                }
                if(res.data.unit_kind_id && res.data.unit_kind_id === Constants.USER_KIND['VISITOR']){
                    setUserType('Visitantes')
                }
                if(res.data.unit_kind_id && res.data.unit_kind_id === Constants.USER_KIND['THIRD']){
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
        setIsScanning(true)
        setLoading(false)
    }

    const handleError = err => {
        console.log(err)
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
                                {!dataFetched.Unit?.Vehicles.length && <p style={{pDecorationLine: 'underline', fontSize: 15,}}>Não há veículos cadastrados.</p>}
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
                                    <div className={classes.UserDataDiv}>
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
                            {!dataFetched.Vehicles.length && <p style={{textDecorationLine: 'underline', fontSize: 15,}}>Não há veículos cadastrados.</p>}
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
                    </div>
                }
                { !isScanning && <div className='col-12 my-4 text-center'>
                    <button type="button" className="btn btn-primary btn-lg" onClick={rescanHandler}>Reescanear</button>
                </div>}
            </div>
        </Body>
    );
};

export default MyQrCode;