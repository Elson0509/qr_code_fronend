import React, { useState } from 'react'
import Body from '../../../layout/Body'
import { useAuth } from '../../../contexts/auth'
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import { Spinner } from 'reactstrap'
import { toast } from 'react-toastify'
import FormInput from '../../../components/Form/FormInput'
import classes from './GuardAdd.module.css'
import ActionButtons from '../../../components/Buttons/ActionButtons'
import ImportPhotoButtons from '../../../components/Buttons/ImportPhotoButtons'
import PicModal from '../../../components/Modals/PicModal'
import CropImageModal from '../../../components/Modals/CropImageModal'

const GuardAdd = (props) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [userBeingAdded, setUserBeingAdded] = useState({ id: "0", name: '', identification: '', email: '', pic: '' })
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

  const breadcrumb = [
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

  const uploadImg = newId => {
    if (userBeingAdded.pic !== '') {
      //resizing and uploading
      Utils.resizeFile(userBeingAdded.pic).then(data => {
        api.post(`upload`, {
          base64Image: data,
          fileName: newId,
          type: 'user'
        })
          .then(res => {
            console.log('success', res.data)
          })
          .catch(err => {
            console.log('error', err.response)
          })
      })
    }
  }

  const confirmHandler = async _ => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    if (!userBeingAdded.name) {
      return setErrorMessage('Nome não pode estar vazio.')
    }
    if (!userBeingAdded.identification) {
      return setErrorMessage('Documento não pode estar vazio.')
    }
    if (!userBeingAdded.email) {
      return setErrorMessage('Email não pode estar vazio.')
    }
    if (!Utils.validateEmail(userBeingAdded.email)) {
      return setErrorMessage('Email não válido.')
    }
    if (!userBeingAdded.pic) {
      return setErrorMessage('É necessário adicionar uma foto.')
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
      .then((res) => {
        uploadImg(res.data.user.id)
        setErrorMessage('')
        setErrorAddResidentMessage('')
        toast.info('Cadastro realizado', Constants.TOAST_CONFIG)
        setUserBeingAdded({ id: "0", name: '', identification: '', email: '', pic: '' })
      })
      .catch((err) => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (GA1)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
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
          value={userBeingAdded.name}
          changeValue={(val) => Utils.testWordWithNoSpecialChars(val) && setUserBeingAdded({ ...userBeingAdded, name: val })}
        />
        <FormInput
          label='Documento*:'
          value={userBeingAdded.identification}
          changeValue={(val) => setUserBeingAdded({ ...userBeingAdded, identification: val })}
        />
        <FormInput
          label='Email*:'
          value={userBeingAdded.email}
          type='email'
          changeValue={(val) => setUserBeingAdded({ ...userBeingAdded, email: val })}
        />
        {!!userBeingAdded.pic &&
          <div className={classes.ImgUserTookPic}>
            <img src={URL.createObjectURL(userBeingAdded.pic)} alt='pic user' height={120} />
          </div>
        }
        {!userBeingAdded.pic &&
          <ImportPhotoButtons
            setImgPath={(img) => setUserBeingAdded({ ...userBeingAdded, pic: img })}
            paperClipImageHandler={(path) => paperClipImageHandler(path)}
            setErrorMessage={setErrorAddResidentMessage}
            cameraClick={() => takePicHandler()} />
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
          action1={() => confirmHandler()}
          action2={() => { props.history.push('/dashboard') }}
        />
      </form>
      {
        takePic && <PicModal
          modal={modalPic}
          toggle={() => toggleModalPic()}
          setImgPath={(img) => setUserBeingAdded({ ...userBeingAdded, pic: img })}
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
          setImgPath={(img) => setUserBeingAdded({ ...userBeingAdded, pic: img })}
          setModalCrop={setModalCrop}
        />
      }
    </Body>
  );
};

export default GuardAdd;