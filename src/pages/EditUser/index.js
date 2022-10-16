import React, { useState } from 'react';
import Body from '../../layout/Body';
import { useAuth } from '../../contexts/auth'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import api from '../../services/api'
import { Spinner } from 'reactstrap'
import classes from './EditUser.module.css'
import FormInput from '../../components/Form/FormInput'
import ActionButtons from '../../components/Buttons/ActionButtons'
import ImportPhotoButtons from '../../components/Buttons/ImportPhotoButtons'
import PicModal from '../../components/Modals/PicModal'
import CropImageModal from '../../components/Modals/CropImageModal'
import ImageCloud from '../../components/ImageCloud'
import InputDate from '../../components/Form/InputDate';
import ButtonIcon from '../../components/Buttons/ButtonIcon'

const EditUser = (props) => {
  //if there is not state in router, go to dashboard
  if (!props.location?.state?.resident) {
    props.history.push('/dashboard')
  }

  const dobUser = props.location.state.resident.dob ? new Date(props.location.state.resident.dob) : null

  const { user } = useAuth()
  const [userEdit, setUserEdit] = useState({ ...props.location.state.resident })
  const [dobUserEdit, setDobUserEdit] = useState(dobUser ? { day: dobUser.getDate(), month: dobUser.getMonth() + 1, year: dobUser.getFullYear() } : { day: '', month: '1', year: '' })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [modalPic, setModalPic] = useState(false)
  const [modalCrop, setModalCrop] = useState(false)
  const [takePic, setTakePic] = useState(false)
  const [pathImgToCrop, setPathImgToCrop] = useState('')
  const [disabled] = useState(!!props.location.state.resident.email)
  const [pic, setPic] = useState(false)
  const [is_owner, setIs_owner] = useState(props.location.state.resident.is_owner)

  const breadcrumb = [
    {
      name: 'Painel Principal',
      link: '/'
    },
    {
      name: 'Editar Morador',
      link: '/resident/edit'
    }
  ]

  const paperClipImageHandler = imgPath => {
    setPathImgToCrop(imgPath)
    setModalCrop(true)
  }

  const closeModalCropHandler = _ => {
    setPathImgToCrop('')
    setModalCrop('')
  }

  const uploadImg = async id => {
    return new Promise((resolve, reject) => {
      //resizing and uploading
      Utils.resizeFile(pic).then(data => {
        api.post(`upload`, {
          base64Image: data,
          fileName: id,
          type: 'user'
        })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err.response)
          })
      })
    })
  }

  const confirmHandler = async _ => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    if (!userEdit.name) {
      return setErrorMessage('Nome não pode estar vazio.')
    }
    if (userEdit.name.length < Constants.MIN_NAME_SIZE) {
      return setErrorMessage(`Nome deve ter no mínimo ${Constants.MIN_NAME_SIZE} caracteres.`)
    }
    if (userEdit.email && !Utils.validateEmail(userEdit.email)) {
      return setErrorMessage('Email não é válido.')
    }
    if (!!userEdit.phone && !Utils.phone_validation(userEdit.phone)) {
      return setErrorMessage('Telefone não válido.')
    }
    if ((!!dobUserEdit.day || !!dobUserEdit.year) && !Utils.isValidDate(dobUserEdit.day, dobUserEdit.month, dobUserEdit.year)) {
      return setErrorMessage('Data não é válida.')
    }
    const dob = user.condo.resident_has_dob && !!dobUserEdit.day && !!dobUserEdit.year ? new Date(dobUserEdit.year, dobUserEdit.month - 1, dobUserEdit.day, 0, 0, 0) : null
    if ((!!dobUserEdit.day || !!dobUserEdit.year) && dob > new Date()) {
      return setErrorMessage('Data não é válida.')
    }
    setLoading(true)
    api.put(`user/${userEdit.id}`, {
      name: userEdit.name,
      email: userEdit.email,
      identification: userEdit.identification,
      phone: userEdit.phone,
      is_owner,
      dob
    })
      .then(() => {
        if (pic) {
          uploadImg(userEdit.id).then(res => {
            setLoading(false)
            props.history.push('/residents/list')
          })
        }
        else {
          setLoading(false)
          props.history.push('/residents/list')
        }
      })
      .catch(err => {
        setLoading(false)
        console.log(err)
        setErrorMessage(err.response?.data?.message)
      })
  }

  const takePicHandler = async _ => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
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

  if (loading) {
    return (
      <Body breadcrumb={breadcrumb}>
        <Spinner color="primary" />
      </Body>
    )
  }

  return (
    <Body breadcrumb={breadcrumb}>
      <form className='pb-4'>
        <FormInput
          label='Nome*:'
          value={userEdit.name}
          changeValue={(val) => Utils.testWordWithNoSpecialChars(val) && setUserEdit({ ...userEdit, name: val })}
        />
        <FormInput
          label='Identidade:'
          value={userEdit.identification}
          changeValue={(val) => setUserEdit({ ...userEdit, identification: val })}
        />
        <FormInput
          label='Email:'
          value={userEdit.email}
          type='email'
          changeValue={(val) => setUserEdit({ ...userEdit, email: val })}
          disabled={disabled}
        />
        {
          user.condo.resident_has_phone &&
          <FormInput
            label='Telefone*:'
            value={userEdit.phone}
            type='text'
            placeholder='(XX) 90000-0000'
            changeValue={(val) => setUserEdit({ ...userEdit, phone: val })}
          />
        }
        {
          user.condo.resident_has_owner_field &&
          <div className='row m-1 my-3'>
            <label>Tipo:</label>
            <ButtonIcon
              newClass='btn-light btn-outline-secondary'
              text={is_owner ? 'Proprietário' : 'Alugado'}
              clicked={()=> setIs_owner(prev => !prev)}
            />
          </div>
        }
        {
          user.condo.resident_has_dob &&
          <InputDate
            title='Nascimento'
            date={dobUserEdit}
            setDate={setDobUserEdit}
            maxYear={new Date().getFullYear()}
            minYear={new Date().getFullYear() - 110}
          />
        }
        {
          !pic &&
          <div className={`${classes.PreviewImage} col-12 `}>
            <div className='col-6'>
              <ImageCloud id={userEdit.photo_id} />
            </div>
          </div>
        }

        {
          !!pic &&
          <div className={classes.ImgUserTookPic}>
            <img src={URL.createObjectURL(pic)} alt='pic user' height={200} />
          </div>
        }
        {
          !pic &&
          <ImportPhotoButtons
            setImgPath={(img) => setPic(pic)}
            paperClipImageHandler={(path) => paperClipImageHandler(path)}
            setErrorMessage={setErrorMessage}
            cameraClick={() => takePicHandler()} />
        }
        {
          !!errorMessage &&
          <div className="alert alert-danger text-center mt-2" role="alert">
            {errorMessage}
          </div>
        }
        <ActionButtons
          textButton1='Confirmar'
          textButton2='Cancelar'
          action1={() => confirmHandler()}
          action2={() => { props.history.push('/dashboard') }}
        />
      </form>
      {
        takePic && <PicModal
          modal={modalPic}
          toggle={() => toggleModalPic()}
          setImgPath={(img) => setPic(img)}
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
          setImgPath={(img) => setPic(img)}
          setModalCrop={setModalCrop}
        />
      }
    </Body>
  );
};

export default EditUser;