import React, { useState } from 'react';
import Body from '../../layout/Body';
import { useAuth } from '../../contexts/auth'
import * as Constants from '../../services/constants'
import QrReader from 'react-qr-reader'
import * as Utils from '../../services/util'
import api from '../../services/api'
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
                if(res.data.user_kind_id == Constants.USER_KIND['SUPERINTENDENT']){
                    setUserType('Administrador')
                }
                if(res.data.unit_kind_id && res.data.unit_kind_id === Constants.USER_KIND['VISITOR']){
                    setUserType('Visitantes')
                }
                if(res.data.unit_kind_id && res.data.unit_kind_id === Constants.USER_KIND['THIRD']){
                    setUserType('Terceirizados')
                }
                console.log(res.data)
                
            })
            .catch(err=>{
                setErrorMessage(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (SC1)')
            })
            .finally(()=>{
                setLoading(false)
            })

        }
    }

    const handleError = err => {
        console.log(err)
    }

    if(loading){
        return (
            <Spinner color="primary" />
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
                        <h4 className='h4'>{userType}</h4>
                        <div>
                            <div></div>
                            <div>
                                <p style={{marginTop: 8, fontSize: 18, fontWeight: 'bold'}}>{dataFetched.name}</p>
                                {!!dataFetched.Unit?.Bloco?.name && <p style={{marginTop: 4, fontSize: 18}}>{`Bloco ${dataFetched.Unit.Bloco.name}`}</p>}
                                {!!dataFetched.Unit?.number && <p style={{marginTop: 4, fontSize: 18, marginBottom: 20}}>{`Unidade ${dataFetched.Unit.number}`}</p>}
                                {!dataFetched.Unit?.Vehicles.length && <p style={{pDecorationLine: 'underline', fontSize: 15,}}>Não há veículos cadastrados.</p>}
                                {!!dataFetched.Unit?.Vehicles.length && <p style={{fontSize: 15, marginBottom: 0}}>Veículos cadastrados:</p>}
                                {!!dataFetched.Unit?.Vehicles.length && 
                                    dataFetched.Unit?.Vehicles.map((el, ind)=>{
                                        return (
                                            <div key={ind} style={{borderBottomWidth: 1, padding: 12}}>
                                                <p style={{pAlign: 'center', fontSize: 15, fontWeight: 'bold', marginBottom: 5}}>{`${el.maker} ${el.model} ${el.color}`}</p>
                                                {/* <Placa placa={el.plate}/> */}
                                            </div>
                                        )
                                    })}
                            </div>

                        </div>
                    </div>

                }
                {!!dataFetched && dataFetched.unit_kind_id &&
                    <div>
                        <h4 className='h4'>{userType}</h4>
                        <div>

                        </div>
                    </div>
                }
            </div>
        </Body>
    );
};

export default MyQrCode;