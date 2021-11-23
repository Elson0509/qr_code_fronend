import React, { useState, useEffect } from 'react';
import Body from '../../../layout/Body';
import { useAuth } from '../../../contexts/auth'
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import Plate from '../../../components/Plate'
import FormComment from '../../../components/Form/FormComment'
import PicModal from '../../../components/Modals/PicModal';
import CropImageModal from '../../../components/Modals/CropImageModal';
import ImportPhotoButtons from '../../../components/Buttons/ImportPhotoButtons';
import ActionButtons from '../../../components/Buttons/ActionButtons';
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import classes from './CarSearch.module.css'
import {
    Card, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle, CardHeader,
  } from 'reactstrap';

const CarSearch = (props) => {
    const {user} = useAuth()
    const [cars, setCars] = useState([])
    const [checked, setChecked] = useState(false)
    const [is_registered_vehicle, setIs_registered_vehicle] = useState(false)
    const [image, setImage] = useState('')
    const [comment, setComment] = useState('')
    const [errorAddResidentMessage, setErrorAddResidentMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [searchInput, setSearchInput] = useState('')
    const [modalPic, setModalPic] = useState(false)
    const [modalCrop, setModalCrop] = useState(false)
    const [takePic, setTakePic] = useState(false)
    const [pathImgToCrop, setPathImgToCrop] = useState('') 

    const breadcrumb=[
        {
            name: 'Painel Principal',
            link: '/'
        },
        {
            name: 'Pesquisar Veículos',
            link: '/car/search'
        }
    ]

    useEffect(()=>{
        fetchUsers()
    }, [])

    const fetchUsers = _ => {
        api.get(`vehicle/condo/${user.condo_id}`)
            .then(resp=>{
                setCars(resp.data)
            })
            .catch(err=>{
                toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CS1)', Constants.TOAST_CONFIG)
            })
            .finally(()=>{
                setLoading(false)
            })
    }

    const filterData = _ => {
        if(!searchInput)
          return []
        let filteredData = cars
  
        if(!!searchInput){
          filteredData = filteredData.filter(el => {
            return el.plate.trim().toLowerCase().indexOf(searchInput.trim().toLowerCase()) >=0
          })
        }
        return filteredData
    }

    const uploadImg = newId =>{
        if(image!=''){
          //resizing and uploading
          Utils.resizeFile(image).then(data=>{
            api.post(`upload`,{
              base64Image: data,
              fileName: newId
            })
            .then(res=>{
              console.log('success', res.data)
            })
            .catch(err=>{
              console.log('error', err.response)
            })
          })
        }
    }

    const closeModalCropHandler = _ => {
        setPathImgToCrop('')
        setModalCrop('')
    }

    const takePicHandler = _ => {
        setTakePic(true)
        setModalPic(true)
    }
  
    const confirmTakePick = _ => {
        setTakePic(false)
        setModalPic(false)
    }
  
    const toggleModalPic = _ => {
        setModalPic(false)
        setTakePic(false)
    }

    const paperClipImageHandler = imgPath => {
        setPathImgToCrop(imgPath)
        setModalCrop(true)
    }

    const confirmHandler = _ => {
        if(!image){
          return setErrorMessage('É necessário inserir uma imagem.')
        }
        setErrorMessage('')
        api.post('overnight', {
          description: comment,
          is_registered_vehicle
        })
        .then((res)=> {
          uploadImg(res.data.overnightRegistered.id)
          cancelHandler()
          toast.info('Informação registrada.', Constants.TOAST_CONFIG)
        })
        .catch((err)=>{
          toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CS1)', Constants.TOAST_CONFIG)
        })
    }

    const cancelHandler = _ => {
        setErrorMessage('')
        setComment('')
        setSearchInput('')
        setChecked(false)
        setImage('')
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
                    <div class="form-group">
                        <label>Pesquisar</label>
                        <input className="form-control" placeholder="Digite a placa" value={searchInput} onChange={(ev)=>setSearchInput(ev.target.value)}/>
                    </div>
                    <div class="form-check py-2">
                        <label>Registrar ocorrência?</label>
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            value={checked}
                            onChange={(ev)=>setChecked(ev.target.checked)}
                        />
                    </div>
                </form>
                {
                    !!searchInput.trim() && filterData().length === 0 && (
                        <div className="alert alert-danger my-4 text-center" role="alert">
                            Não há veículos que satisfazem a pesquisa
                        </div>
                    )
                }
                </div>
                    {
                        cars.length>0 && (
                            filterData().map(el=>(
                                <div className='col-lg-6 col-md-12 mb-4 p-2' key={el.id}>
                                    <Card body outline color="info">
                                        <CardHeader>
                                            <CardTitle tag="h4" className='text-center'>Bloco {el.Unit.Bloco.name}</CardTitle>
                                            <CardSubtitle tag="h5" className="mb-2 text-muted text-center">Unidade {el.Unit.number}</CardSubtitle>
                                        </CardHeader>
                                        <CardBody className='text-center'>
                                            <Plate plate={el.plate}/>
                                        </CardBody>
                                    </Card>
                                </div>
                            ))
                        )
                    }
                    {
                        ((!!searchInput.trim() && filterData().length === 0) || checked) && (
                            <div className='mb-4'>
                               <hr/>
                               <h4 className='h4 text-center'>Reportar Veículo</h4>
                               <FormComment
                                    label='Detalhes da ocorrência'
                                    value={comment}
                                    changeValue={setComment}
                               />
                               <div>
                                    <p>
                                        Veículo está cadastrado? 
                                        <span onClick={()=>setIs_registered_vehicle(prev=>!prev)} className={`${classes.Registered} ${is_registered_vehicle ? classes.RegisteredTrue : classes.RegisteredFalse}`}>
                                            {is_registered_vehicle ? 'Sim' : 'Não'}
                                        </span>
                                    </p>
                               </div>
                               {!!image &&
                                    <div className={classes.ImgUserTookPic}>
                                        <img src={URL.createObjectURL(image)} height={150}/>
                                    </div>
                                }
                                {!image && 
                                    <ImportPhotoButtons 
                                        setImgPath={(img)=>setImage(img)} 
                                        paperClipImageHandler={(path)=>paperClipImageHandler(path)}
                                        setErrorMessage={setErrorAddResidentMessage}
                                        cameraClick={() => takePicHandler()}/>
                                }
                                {!!errorAddResidentMessage && 
                                    <div className="alert alert-danger text-center mt-2 text-center" role="alert">
                                        {errorAddResidentMessage}
                                    </div>
                                }
                                {!!errorMessage && 
                                    <div className="alert alert-danger text-center mt-2 text-center" role="alert">
                                        {errorMessage}
                                    </div>
                                }
                                <ActionButtons
                                    textButton1='Confirmar'
                                    textButton2='Cancelar'
                                    action1={()=>confirmHandler()}
                                    action2={()=>cancelHandler()}
                                />
                            </div>
                        )
                    }
                    
            </div>
            {
                takePic && <PicModal 
                    modal={modalPic}
                    toggle={()=> toggleModalPic()}
                    setImgPath={(img)=>setImage(img)}
                    confirmTakePick={confirmTakePick}
                    takePic={takePic}
                />
            }
            {
                modalCrop && 
                <CropImageModal
                    modal={modalCrop}
                    closeModalCropHandler={closeModalCropHandler}
                    pathImgToCrop={pathImgToCrop}
                    setImgPath={(img)=>setImage(img)}
                    setModalCrop={setModalCrop}
                />
            }
        </Body>
    );
};

export default CarSearch;