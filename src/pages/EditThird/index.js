import React, { useState } from 'react';
import Body from '../../layout/Body';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import api from '../../services/api'
import { Spinner } from 'reactstrap'
import { toast } from 'react-toastify'
import classes from './style.module.css'
import FormInput from '../../components/Form/FormInput'
import ActionButtons from '../../components/Buttons/ActionButtons'
import ImportPhotoButtons from '../../components/Buttons/ImportPhotoButtons'
import PicModal from '../../components/Modals/PicModal'
import CropImageModal from '../../components/Modals/CropImageModal'
import ImageCloud from '../../components/ImageCloud'

const EditThird = (props) => {
  //if there is not state in router, go to dashboard
  if (!props.location?.state?.resident) {
    props.history.push('/dashboard')
  }

  const [userEdit, setUserEdit] = useState({ ...props.location.state.resident })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [modalPic, setModalPic] = useState(false)
  const [modalCrop, setModalCrop] = useState(false)
  const [takePic, setTakePic] = useState(false)
  const [pathImgToCrop, setPathImgToCrop] = useState('')
  const [pic, setPic] = useState(false)

  console.log(props.location.state.resident)

  const breadcrumb = [
    {
      name: 'Painel Principal',
      link: '/'
    },
    {
      name: 'Editar Terceirizado',
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
    if (!userEdit.identification) {
      return setErrorMessage('Identidade não pode estar vazio.')
    }
    if (!userEdit.company) {
      return setErrorMessage('Empresa não pode estar vazio.')
    }
    setLoading(true)
    api.put(`user/${userEdit.id}`, {
      name: userEdit.name,
      identification: userEdit.identification,
      company: userEdit.company,
    })
      .then(() => {
        if (pic) {
          uploadImg(userEdit.id).then(res => {
            setLoading(false)
            props.history.push('/thirds/list')
          })
        }
        else {
          setLoading(false)
          props.history.push('/thirds/list')
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
          label='Identidade*:'
          value={userEdit.identification}
          changeValue={(val) => setUserEdit({ ...userEdit, identification: val })}
        />
        <FormInput
          label='Empresa*:'
          value={userEdit.company}
          changeValue={(val) => setUserEdit({ ...userEdit, company: val })}
        />
        {
          !pic &&
          <div className={`${classes.PreviewImage} col-12 `}>
            <div className='col-6'>
              <ImageCloud id={userEdit.photo_id} />
            </div>
          </div>
        }

        {!!pic &&
          <div className={classes.ImgUserTookPic}>
            <img src={URL.createObjectURL(pic)} alt='pic user' height={200} />
          </div>
        }
        {!pic &&
          <ImportPhotoButtons
            setImgPath={(img) => setPic(pic)}
            paperClipImageHandler={(path) => paperClipImageHandler(path)}
            setErrorMessage={setErrorMessage}
            cameraClick={() => takePicHandler()} />
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

export default EditThird;