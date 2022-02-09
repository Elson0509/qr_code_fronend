import React, { useState, useEffect } from 'react';
import Body from '../../../layout/Body';
import { useAuth } from '../../../contexts/auth'
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import { Spinner } from 'reactstrap'
import { toast } from 'react-toastify'
import FormInput from '../../../components/Form/FormInput'
import SelectInput from '../../../components/Form/SelectInput';
import classes from './SindicoAdd.module.css'
import ActionButtons from '../../../components/Buttons/ActionButtons'
import ImportPhotoButtons from '../../../components/Buttons/ImportPhotoButtons'
import PicModal from '../../../components/Modals/PicModal'
import CropImageModal from '../../../components/Modals/CropImageModal';

const SindicoAdd = (props) => {
    const {user} = useAuth()
    const [condos, setCondos] = useState([])
    const [loading, setLoading] = useState(true)
    const [userBeingAdded, setUserBeingAdded]= useState({id: "0", name: '', identification: '', email: '', condoIndex: 0, pic: ''})
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
            name: 'Adicionar Administrador',
            link: '/sindico/add'
        }
    ]

    useEffect(()=>{
      fetchCondos()
    }, [])

    const fetchCondos = _ => {
      api.get(`condo`)
      .then(resp=>{
        setCondos(resp.data)
        if(resp.data.length)
          setUserBeingAdded({...userBeingAdded, condo_id: resp.data[0].id})
      })
      .catch(err=>{
        toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (SA1)', Constants.TOAST_CONFIG)
      })
      .finally(()=>{
        setLoading(false)
      })
    }

    const closeModalCropHandler = _ => {
      setPathImgToCrop('')
      setModalCrop('')
    }

    const uploadImg = newId =>{
      if(userBeingAdded.pic!==''){
        //resizing and uploading
        Utils.resizeFile(userBeingAdded.pic).then(data=>{
          api.post(`upload`,{
            base64Image: data,
            fileName: newId,
            type: 'user'
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
      if(!userBeingAdded.condo_id){
        return setErrorMessage('Selecione um condomínio.')
      }
      if(!Utils.validateEmail(userBeingAdded.email)){
        return setErrorMessage('Email não válido.')
      }

      setLoading(true)
      api.post('user/signup', {
        name: userBeingAdded.name,
        condo_id: condos[userBeingAdded.condoIndex].id,
        user_kind_id: Constants.USER_KIND["SUPERINTENDENT"],
        identification: userBeingAdded.identification,
        email: userBeingAdded.email,
        user_id_last_modify: user.id,
      })
      .then((res)=>{
        uploadImg(res.data.user.id)
        setErrorMessage('')
        setErrorAddResidentMessage('')
        toast.info('Cadastro realizado', Constants.TOAST_CONFIG)
        setUserBeingAdded({...userBeingAdded, id: "0", name: '', identification: '', email: '', pic: ''})
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
        {!!condos.length &&
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
          <SelectInput
            label='Condomínio*:'
            value={userBeingAdded.condoIndex}
            changeValue={(val) => setUserBeingAdded({...userBeingAdded, condoIndex: val})}
            options={condos}
          />
          {!!userBeingAdded.pic &&
            <div className={classes.ImgUserTookPic}>
              <img src={URL.createObjectURL(userBeingAdded.pic)} alt='pic user' height={120}/>
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
        }
        {
          !condos.length &&
            <h4 className='h4'>Não há condomínios cadastrados</h4>
        }
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

export default SindicoAdd;