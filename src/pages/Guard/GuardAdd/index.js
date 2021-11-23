import React, { useState, useEffect, Fragment } from 'react';
import Body from '../../../layout/Body';
import { useAuth } from '../../../contexts/auth'
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import Plate from '../../../components/Plate'
import Image from '../../../components/Image'
import ImageBlob from '../../../components/ImageBlob'
import BlocoModal from '../../../components/Modals/BlocoModal'
import UnitModal from '../../../components/Modals/UnitModal'
import Icon from '../../../components/Icon'
import { Spinner } from 'reactstrap'
import { toast } from 'react-toastify'
import FormInput from '../../../components/Form/FormInput'
import SelectButton from '../../../components/Buttons/SelectButton'
import classes from './GuardAdd.module.css'
import ActionButtons from '../../../components/Buttons/ActionButtons'
import ImportPhotoButtons from '../../../components/Buttons/ImportPhotoButtons'
import PicModal from '../../../components/Modals/PicModal'
import CropImageModal from '../../../components/Modals/CropImageModal';

const GuardAdd = (props) => {
    const {user} = useAuth()
    const [loading, setLoading] = useState(false)
    const [userBeingAdded, setUserBeingAdded]= useState({id: "0", name: '', identification: '', email: '', pic: ''})
    const [errorMessage, setErrorMessage] = useState('')
    const [errorAddResidentMessage, setErrorAddResidentMessage] = useState('')
    const [modalPic, setModalPic] = useState(false)
    const [modalCrop, setModalCrop] = useState(false)
    const [takePic, setTakePic] = useState(false)
    const [pathImgToCrop, setPathImgToCrop] = useState('')   

    const paperClipImageHandler = imgPath => {
      setPathImgToCrop(imgPath)
      setModalCrop(true)
    }

    const breadcrumb=[
        {
            name: 'Painel Principal',
            link: '/'
        },
        {
            name: 'Adicionar Guarda',
            link: '/guards/add'
        }
    ]

    const closeModalCropHandler = _ => {
      setPathImgToCrop('')
      setModalCrop('')
    }


    const uploadImg = newId =>{
      if(userBeingAdded.pic!=''){
        //resizing and uploading
        Utils.resizeFile(userBeingAdded.pic).then(data=>{
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

    const confirmHandler = _ =>{
      if(!userBeingAdded.name){
        return setErrorMessage('Nome não pode estar vazio.')
      }
      if(!userBeingAdded.email){
        return setErrorMessage('Email não pode estar vazio.')
      }
      if(!Utils.validateEmail(userBeingAdded.email)){
        return setErrorMessage('Email não válido.')
      }

      setLoading(true)
      api.post('user/signup', {
        name: userBeingAdded.name,
        condo_id: user.condo_id,
        user_kind_id: Constants.USER_KIND["GUARD"],
        identification: userBeingAdded.identification,
        email: userBeingAdded.email,
        userBeingAdded_id_last_modify: user.id,
      })
      .then((res)=>{
        uploadImg(res.data.userId)
        setErrorMessage('')
        setErrorAddResidentMessage('')
        toast.info('Cadastro realizado', Constants.TOAST_CONFIG)
        setUserBeingAdded({id: "0", name: '', identification: '', email: '', pic: ''})
      })
      .catch((err)=> {
        toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (GA1)', Constants.TOAST_CONFIG)
      })
      .finally(()=>{
        setLoading(false)
      })
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

    if(loading){
      return (
          <Body breadcrumb={breadcrumb}>
              <Spinner color="primary"/>
          </Body>
      )
    }

    return (
      <Body breadcrumb={breadcrumb}>
        <form className='pb-4'>
          <FormInput
            label='Nome*:'
            value={userBeingAdded.name}
            changeValue={(val) => setUserBeingAdded({...userBeingAdded, name: val})}
          />
          <FormInput
            label='Identidade:'
            value={userBeingAdded.identification}
            changeValue={(val) => setUserBeingAdded({...userBeingAdded, identification: val})}
          />
          <FormInput
            label='Email*:'
            value={userBeingAdded.email}
            type='email'
            changeValue={(val) => setUserBeingAdded({...userBeingAdded, email: val})}
          />
          {!!userBeingAdded.pic &&
            <div className={classes.ImgUserTookPic}>
              <img src={URL.createObjectURL(userBeingAdded.pic)} height={120}/>
            </div>
          }
          {!userBeingAdded.pic && 
            <ImportPhotoButtons 
              setImgPath={(img)=>setUserBeingAdded({...userBeingAdded, pic: img})} 
              paperClipImageHandler={(path)=>paperClipImageHandler(path)}
              setErrorMessage={setErrorAddResidentMessage}
              cameraClick={() => takePicHandler()}/>
          }
          {!!errorAddResidentMessage && 
            <div className="alert alert-danger text-center mt-2" role="alert">
              {errorAddResidentMessage}
            </div>
          }
          {!!errorMessage && 
            <div className="alert alert-danger text-center mt-2" role="alert">
              {errorMessage}
            </div>
          }
          <ActionButtons
            textButton1='Confirmar'
            textButton2='Cancelar'
            action1={()=>confirmHandler()}
            action2={()=>{props.history.push('/dashboard')}}
          />
        </form>
          {
            takePic && <PicModal 
              modal={modalPic}
              toggle={()=> toggleModalPic()}
              setImgPath={(img)=>setUserBeingAdded({...userBeingAdded, pic: img})}
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
              setImgPath={(img)=>setUserBeingAdded({...userBeingAdded, pic: img})}
              setModalCrop={setModalCrop}
            />
          }
      </Body>
    );
};

export default GuardAdd;