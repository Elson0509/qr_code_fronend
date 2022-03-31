import React, { useState, useEffect } from 'react';
import Body from '../../../layout/Body';
import { useAuth } from '../../../contexts/auth'
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import ImageCloud from '../../../components/ImageCloud'
import ImageBlob from '../../../components/ImageBlob'
import BlocoModal from '../../../components/Modals/BlocoModal'
import UnitModal from '../../../components/Modals/UnitModal'
import Icon from '../../../components/Icon'
import { Spinner } from 'reactstrap'
import { toast } from 'react-toastify'
import FormInput from '../../../components/Form/FormInput'
import SelectButton from '../../../components/Buttons/SelectButton'
import classes from './ResidentAdd.module.css'
import ActionButtons from '../../../components/Buttons/ActionButtons'
import ImportPhotoButtons from '../../../components/Buttons/ImportPhotoButtons'
import PicModal from '../../../components/Modals/PicModal'
import CropImageModal from '../../../components/Modals/CropImageModal';

const ResidentAdd = (props) => {
  const { user } = useAuth()
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [residents, setResidents] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [errorAddResidentMessage, setErrorAddResidentMessage] = useState('')
  const [errorAddVehicleMessage, setErrorAddVehicleMessage] = useState('')
  const [vehicleBeingAdded, setVehicleBeingAdded] = useState({ id: "0", maker: '', model: '', color: '', plate: '' })
  const [userBeingAdded, setUserBeingAdded] = useState({ id: "0", name: '', identification: '', email: '', pic: '' })
  const [modalPic, setModalPic] = useState(false)
  const [modalCrop, setModalCrop] = useState(false)
  const [modalSelectBloco, setModalSelectBloco] = useState(false)
  const [modalSelectUnit, setModalSelectUnit] = useState(false)
  const [selectedBloco, setSelectedBloco] = useState(null)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [isAddingResident, setIsAddingResident] = useState(false)
  const [isAddingVehicle, setIsAddingVehicle] = useState(false)
  const [takePic, setTakePic] = useState(false)
  const [pathImgToCrop, setPathImgToCrop] = useState('')

  const paperClipImageHandler = async imgPath => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    setPathImgToCrop(imgPath)
    setModalCrop(true)
  }

  const breadcrumb = [
    {
      name: 'Painel Principal',
      link: '/'
    },
    {
      name: 'Adicionar Moradores',
      link: '/residents/add'
    }
  ]

  useEffect(() => {
    api.get(`condo/all/${user.condo_id}`)
      .then(res => {
        setUnits(res.data)
        setModalSelectBloco(true)
      })
      .catch(err => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA1)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const closeModalCropHandler = _ => {
    setPathImgToCrop('')
    setModalCrop('')
  }

  const removeResident = async index => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    let residentsCopy = [...residents]
    residentsCopy.splice(index, 1)
    setResidents(residentsCopy)
  }

  const removeVehicle = async index => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    const vehiclesCopy = [...vehicles]
    vehiclesCopy.splice(index, 1)
    setVehicles(vehiclesCopy)
  }

  const addResidentHandler = async _ => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    if (!userBeingAdded.name) {
      return setErrorAddResidentMessage('Nome não pode estar vazio.')
    }
    if (!userBeingAdded.email) {
      return setErrorAddResidentMessage('Email não pode estar vazio.')
    }
    if (!Utils.validateEmail(userBeingAdded.email)) {
      return setErrorAddResidentMessage('Email não é válido.')
    }
    setResidents(prev => [...prev, userBeingAdded])
    setErrorAddResidentMessage('')
    setUserBeingAdded({ id: "0", name: '', identification: '', email: '', pic: '' })
    setIsAddingResident(false)
  }

  const cancelAddResidentHandler = _ => {
    setIsAddingResident(false)
    setUserBeingAdded({ id: '0', name: '', identification: '', email: '', pic: '' })
  }

  const addVehicleHandler = async _ => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    if (!vehicleBeingAdded.maker) {
      return setErrorAddVehicleMessage('Fabricante não pode estar vazio.')
    }
    if (!vehicleBeingAdded.model) {
      return setErrorAddVehicleMessage('Modelo não pode estar vazio.')
    }
    if (!vehicleBeingAdded.color) {
      return setErrorAddVehicleMessage('Cor não pode estar vazia.')
    }
    if (!vehicleBeingAdded.plate) {
      return setErrorAddVehicleMessage('Placa não pode estar vazia.')
    }
    if (!Utils.validatePlateFormat(vehicleBeingAdded.plate)) {
      return setErrorAddVehicleMessage('Formato de placa inválido.')
    }
    setVehicles(prev => [...prev, vehicleBeingAdded])
    setErrorAddVehicleMessage('')
    setVehicleBeingAdded({ id: '0', maker: '', model: '', color: '', plate: '' })
    setIsAddingVehicle(false)
  }

  const cancelVehicleHandler = _ => {
    setVehicleBeingAdded({ id: '0', maker: '', model: '', color: '', plate: '' })
    setIsAddingVehicle(false)
  }

  const selectBlocoHandler = bloco => {
    setSelectedBloco(bloco)
    setModalSelectBloco(false)
    setModalSelectUnit(true)
  }

  const selectUnitHandler = async unit => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    setSelectedUnit(unit)
    setModalSelectUnit(false)
    setLoading(true)
    api.get(`user/unit/${unit.id}/${Constants.USER_KIND.RESIDENT}`)
      .then(res => {
        setResidents(res.data)
        api.get(`vehicle/${unit.id}/${Constants.USER_KIND.RESIDENT}`)
          .then(res2 => {
            setVehicles(res2.data)
          })
          .catch(err2 => {
            Utils.toastError(err2, err2.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA2)', Constants.TOAST_CONFIG)
            setSelectedUnit(null)
            setSelectedBloco(null)
          })
      })
      .catch(err => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA3)', Constants.TOAST_CONFIG)
        setSelectedUnit(null)
        setSelectedBloco(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const clearUnit = _ => {
    setSelectedBloco(null)
    setSelectedUnit(null)
  }

  const uploadImgs = newResidents => {
    const residentsPics = []
    newResidents.forEach(nr => {
      residents.forEach(re => {
        if (nr.email === re.email &&
          nr.name === re.name &&
          nr.identification === re.identification &&
          re.pic !== "")
          residentsPics.push({ id: nr.id, pic: re.pic })
      })
    })
    residentsPics.forEach(el => {
      //resizing and uploading
      Utils.resizeFile(el.pic).then(data => {
        api.post(`upload`, {
          base64Image: data,
          fileName: el.id,
          type: 'user'
        })
          .then(res => {
            console.log('success', res.data)
          })
          .catch(err => {
            console.log('error', err.response)
          })
      })

    })
  }

  const confirmHandler = async _ => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    setLoading(true)
    api.post('vehicle/unit', {
      unit_id: selectedUnit.id,
      vehicles,
      user_id_last_modify: user.id
    })
      .then((res) => {
        api.post('user/resident/unit', {
          unit_id: selectedUnit.id,
          residents,
          condo_id: user.condo_id,
          user_id_last_modify: user.id
        })
          .then(res2 => {
            uploadImgs(res2.data.addedResidents)
            toast.info(res2.data.message || 'Registro realizado com sucesso.', Constants.TOAST_CONFIG)
            setSelectedUnit(null)
            setModalSelectBloco(null)
          })
          .catch(err2 => {
            Utils.toastError(err2, err2.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA4)', Constants.TOAST_CONFIG)
          })
      })
      .catch((err) => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA5)', Constants.TOAST_CONFIG)
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

  const toggleModalPic = async _ => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
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
      {/*units*/}
      <SelectButton
        icon='building'
        text='Selecionar Unidade'
        action={() => setModalSelectBloco(true)}
      >
        {!!selectedBloco && !!selectedUnit && (
          <ul className="list-group">
            <li className="list-group-item bg-primary bg-opacity-25 d-flex justify-content-between align-items-start">
              <span>Bloco {selectedBloco.name} unidade {selectedUnit.number}</span>
              <span className={classes.CloseIcon} onClick={() => clearUnit()}><Icon icon='window-close' color={Constants.closeButtonCollor} /></span>
            </li>
          </ul>
        )}
      </SelectButton>
      {/*residents*/}
      {!!selectedBloco && !!selectedUnit && (
        <SelectButton
          icon='user'
          text='Adicionar Morador'
          action={() => setIsAddingResident(true)}
        >
          {isAddingResident && (
            <form className='pb-4'>
              <FormInput
                label='Nome*:'
                value={userBeingAdded.name}
                changeValue={(val) => setUserBeingAdded({ ...userBeingAdded, name: val })}
              />
              <FormInput
                label='Identidade:'
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
              <ActionButtons
                textButton1='Incluir morador'
                textButton2='Cancelar'
                action1={() => addResidentHandler()}
                action2={() => cancelAddResidentHandler()}
              />
            </form>
          )}
          <ul className="list-group">
            {
              !!residents.length && residents.map((el, ind) => (
                <li className="list-group-item bg-primary bg-opacity-25 d-flex justify-content-between align-items-start" key={el.id + el.name + el.email}>
                  <div className={classes.ResidentBox}>
                    <div className={classes.ResidentImage}>
                      {
                        el.id === '0' ?
                          <ImageBlob path={el.pic} />
                          :
                          <ImageCloud id={el.photo_id}/>
                      }
                    </div>
                    <div>
                      <p className={classes.Text}><span className={classes.Bold}>Nome:</span> {el.name}</p>
                      <p className={classes.Text}><span className={classes.Bold}>Email:</span> {el.email}</p>
                    </div>
                  </div>
                  <span className={classes.CloseIcon} onClick={() => removeResident(ind)}><Icon icon='window-close' color={Constants.closeButtonCollor} /></span>
                </li>
              ))
            }
          </ul>
        </SelectButton>
      )
      }
      {/*vehicles*/}
      {!!selectedBloco && !!selectedUnit && (
        <SelectButton
          icon='car'
          text='Adicionar Veículo'
          action={() => setIsAddingVehicle(true)}
        >
          {isAddingVehicle && (
            <form className='pb-4'>
              <FormInput
                label='Fabricante*:'
                value={vehicleBeingAdded.maker}
                changeValue={(val) => setVehicleBeingAdded({ ...vehicleBeingAdded, maker: val })}
              />
              <FormInput
                label='Modelo*:'
                value={vehicleBeingAdded.model}
                changeValue={(val) => setVehicleBeingAdded({ ...vehicleBeingAdded, model: val })}
              />
              <FormInput
                label='Cor*:'
                value={vehicleBeingAdded.color}
                changeValue={(val) => setVehicleBeingAdded({ ...vehicleBeingAdded, color: val })}
              />
              <FormInput
                label='Placa*:'
                value={vehicleBeingAdded.plate}
                changeValue={(val) => setVehicleBeingAdded({ ...vehicleBeingAdded, plate: val })}
              />
              {!!errorAddVehicleMessage &&
                <div className="alert alert-danger text-center mt-2" role="alert">
                  {errorAddVehicleMessage}
                </div>
              }
              <ActionButtons
                textButton1='Incluir veículo'
                textButton2='Cancelar'
                action1={() => addVehicleHandler()}
                action2={() => cancelVehicleHandler()}
              />
            </form>
          )}
          <ul className="list-group">
            {
              !!vehicles.length && vehicles.map((el, ind) => (
                <li className="list-group-item bg-primary bg-opacity-25 d-flex justify-content-between align-items-start" key={el.id + el.color + el.model + el.plate + el.maker}>
                  <div>
                    <p className={classes.Text}>{el.maker} {el.model} {el.color}</p>
                    <p className={classes.Text}><span className={classes.Bold}>Placa:</span> {el.plate}</p>
                  </div>
                  <span className={classes.CloseIcon} onClick={() => removeVehicle(ind)}><Icon icon='window-close' color={Constants.closeButtonCollor} /></span>
                </li>
              ))
            }
          </ul>
        </SelectButton>
      )
      }
      {!!selectedBloco && !!selectedUnit && !isAddingVehicle && !isAddingResident && (
        <ActionButtons
          textButton1='Cadastrar moradores'
          textButton2='Cancelar'
          action1={() => confirmHandler()}
          action2={() => props.history.push('/dashboard')}
        />
      )
      }
      {
        !!units.length &&
        <BlocoModal
          blocos={units}
          modal={modalSelectBloco}
          toggle={setModalSelectBloco}
          action={(el) => { selectBlocoHandler(el) }}
        />
      }
      {
        !!selectedBloco &&
        <UnitModal
          bloco={selectedBloco}
          modal={modalSelectUnit}
          toggle={setModalSelectUnit}
          action={(el) => { selectUnitHandler(el) }}
        />
      }
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

export default ResidentAdd;