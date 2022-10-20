import React, { useState, useEffect } from 'react'
import Body from '../../../layout/Body'
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import { useAuth } from '../../../contexts/auth'
import api from '../../../services/api'
import { Alert, Spinner } from 'reactstrap'
import { toast } from 'react-toastify'
import ButtonIcon from '../../../components/Buttons/ButtonIcon'
import FormInput from '../../../components/Form/FormInput'
import FormComment from '../../../components/Form/FormComment'
import BlocoModal from '../../../components/Modals/BlocoModal'
import UnitModal from '../../../components/Modals/UnitModal'
import ImportPhotoButtons from '../../../components/Buttons/ImportPhotoButtons'
import CropImageModal from '../../../components/Modals/CropImageModal'
import PicModal from '../../../components/Modals/PicModal'
import ActionButtons from '../../../components/Buttons/ActionButtons'

const MailAdd = (props) => {

  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [blocos, setBlocos] = useState([])
  const [tracker, setTracker] = useState('')
  const [comment, setComment] = useState('')
  const [pic, setPic] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isTakingPic, setIsTakingPic] = useState(false)
  const [modalSelectBloco, setModalSelectBloco] = useState(false)
  const [modalSelectUnit, setModalSelectUnit] = useState(false)
  const [selectedBloco, setSelectedBloco] = useState(null)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [textButton, setTextButton] = useState('Selecionar Unidade')
  const [modalPic, setModalPic] = useState(false)
  const [modalCrop, setModalCrop] = useState(false)
  const [takePic, setTakePic] = useState(false)
  const [pathImgToCrop, setPathImgToCrop] = useState('')

  const breadcrumb = [
    {
      name: 'Painel Principal',
      link: '/'
    },
    {
      name: 'Correios',
      link: '/services/mailadd'
    }
  ]

  //fetching blocos
  useEffect(() => {
    api.get(`condo/all/${user.condo_id}`)
      .then(res => {
        setBlocos(res.data)
        setLoading(false)
      })
      .catch(err => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (MLR1)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const paperClipImageHandler = imgPath => {
    setPathImgToCrop(imgPath)
    setModalCrop(true)
  }

  const closeModalCropHandler = _ => {
    setPathImgToCrop('')
    setModalCrop('')
  }

  const toggleModalPic = _ => {
    setModalPic(false)
    setTakePic(false)
  }

  const takePicHandler = async _ => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    setTakePic(true)
    setModalPic(true)
  }

  const selectBlocoHandler = bloco => {
    setModalSelectBloco(false)
    setSelectedBloco(bloco)
    setModalSelectUnit(true)
  }

  const selectUnitHandler = unit => {
    setModalSelectUnit(false)
    setSelectedUnit(unit)
    setTextButton(`Bloco ${selectedBloco.name} - Unidade ${unit.number}`)
  }

  const confirmTakePick = _ => {
    setTakePic(false)
    setModalPic(false)
  }

  const uploadImg = newId => {
    if (pic !== '') {
      //resizing and uploading
      Utils.resizeFile(pic).then(data => {
        api.post(`upload`, {
          base64Image: data,
          fileName: newId,
          type: 'mail'
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

  const addHandler = async _ => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    if (!tracker) {
      return setErrorMessage('Rastreio não pode estar vazio.')
    }
    if(!selectedUnit){
      return setErrorMessage('É necessário selecionar uma unidade.')
    }
    setLoading(true)
    api.post('mail', {
      tracking_code: tracker,
      notes: comment,
      unit_id: selectedUnit.id
    })
      .then((res) => {
        uploadImg(res.data.mailRegistered.id)
        setErrorMessage('')
        toast.info('Correspondência cadastrada', Constants.TOAST_CONFIG)
        props.history.push('/dashboard') 
      })
      .catch((err) => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (MA1)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
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
      <div className='row'>
        <form className='pb-4'>
          <FormInput
            label='Código de rastreio*:'
            value={tracker}
            changeValue={(val) => setTracker(val)}
          />
          <ButtonIcon
            text={textButton}
            newClass='col-12 btn-success'
            clicked={() => setModalSelectBloco(true)}
          />
          <FormComment
            label='Descrição'
            value={comment}
            changeValue={(value => setComment(value))}
          />
          {
            !!pic &&
            <div style={{ textAlign: 'center' }}>
              <img src={URL.createObjectURL(pic)} alt='user' height={120} />
            </div>
          }
          {
            !pic &&
            <ImportPhotoButtons
              setImgPath={img => setPic(img)}
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
            textButton1='Adicionar'
            textButton2='Cancelar'
            action1={() => addHandler()}
            action2={() => { props.history.push('/services/maillist') }}
          />
        </form>
      </div>
      <BlocoModal
        modal={modalSelectBloco}
        blocos={blocos}
        action={selectBlocoHandler}
      />
      {
        selectedBloco &&
        <UnitModal
          modal={modalSelectUnit}
          bloco={selectedBloco}
          action={selectUnitHandler}
        />
      }
      {
        modalCrop &&
        <CropImageModal
          modal={modalCrop}
          closeModalCropHandler={closeModalCropHandler}
          pathImgToCrop={pathImgToCrop}
          setImgPath={img => setPic(img)}
          setModalCrop={setModalCrop}
        />
      }
      {
        takePic && <PicModal
          modal={modalPic}
          toggle={() => toggleModalPic()}
          setImgPath={img => setPic(img)}
          confirmTakePick={confirmTakePick}
          takePic={takePic}
        />
      }
    </Body>
  )
}

export default MailAdd