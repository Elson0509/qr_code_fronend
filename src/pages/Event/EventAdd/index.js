import React, { useState } from 'react';
import Body from '../../../layout/Body';
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import { Spinner } from 'reactstrap'
import { toast } from 'react-toastify'
import FormInput from '../../../components/Form/FormInput'
import FormComment from '../../../components/Form/FormComment';
import classes from './EventAdd.module.css'
import ActionButtons from '../../../components/Buttons/ActionButtons'
import ImportPhotoButtons from '../../../components/Buttons/ImportPhotoButtons'
import PicModal from '../../../components/Modals/PicModal'
import CropImageModal from '../../../components/Modals/CropImageModal';

const EventAdd = () => {
  const [loading, setLoading] = useState(false)
  const [userBeingAdded, setUserBeingAdded] = useState({ title: '', place: '', description: '', pic: '' })
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
      name: 'Adicionar Ocorrência',
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
          type: 'occurrence'
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

  const addHandler = _ => {
    if (!userBeingAdded.title) {
      return setErrorMessage('Título não pode estar vazio.')
    }
    if (!userBeingAdded.place) {
      return setErrorMessage('Local não pode estar vazio.')
    }
    if (!userBeingAdded.description) {
      return setErrorMessage('Descrição não pode estar vazio.')
    }
    const MIN_TITLE_CHARACTERS = 5
    if (userBeingAdded.title.length <= MIN_TITLE_CHARACTERS) {
      return setErrorMessage(`Título muito curto. Pelo menos ${MIN_TITLE_CHARACTERS} caracteres.`)
    }
    const MIN_PLACE_CHARACTERS = 3
    if (userBeingAdded.place.length <= MIN_PLACE_CHARACTERS) {
      return setErrorMessage(`Local muito curto. Pelo menos ${MIN_PLACE_CHARACTERS} caracteres.`)
    }
    const MIN_DESCRIPTION_CHARACTERS = 10
    if (userBeingAdded.description.length <= MIN_DESCRIPTION_CHARACTERS) {
      return setErrorMessage(`Descrição muito curta. Pelo menos ${MIN_DESCRIPTION_CHARACTERS} caracteres.`)
    }
    if (userBeingAdded.pic === '') {
      return setErrorMessage('Uma foto é necessária.')
    }
    setLoading(true)
    api.post('occurrence', {
      title: userBeingAdded.title,
      place: userBeingAdded.place,
      description: userBeingAdded.description,
    })
      .then((res) => {
        uploadImg(res.data.occurrenceRegistered.id)
        setErrorMessage('')
        toast.info('Cadastro realizado', Constants.TOAST_CONFIG)
        setUserBeingAdded({ title: '', place: '', description: '', pic: '' })
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (EA1)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
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
          label='Título*:'
          value={userBeingAdded.title}
          changeValue={(val) => setUserBeingAdded({ ...userBeingAdded, title: val })}
        />
        <FormInput
          label='Local*:'
          value={userBeingAdded.place}
          changeValue={(val) => setUserBeingAdded({ ...userBeingAdded, place: val })}
        />
        <FormComment
          label='Descrição*:'
          value={userBeingAdded.description}
          changeValue={(val) => setUserBeingAdded({ ...userBeingAdded, description: val })}
        />
        {!!userBeingAdded.pic &&
          <div className={classes.ImgUserTookPic}>
            <img src={URL.createObjectURL(userBeingAdded.pic)} height={120} alt='user' />
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
          action1={() => addHandler()}
          action2={() => { }}
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

export default EventAdd;