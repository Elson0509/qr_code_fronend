import React, { useState, useEffect, Fragment } from 'react';
import Body from '../../../layout/Body';
import { useAuth } from '../../../contexts/auth'
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import Plate from '../../../components/Plate'
import Image from '../../../components/Image'
import ImageBlob from '../../../components/ImageBlob'
import BlocoModal from '../../../components/Modals/BlocoModal';
import UnitModal from '../../../components/Modals/UnitModal';
import Icon from '../../../components/Icon';
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import FormInput from '../../../components/Form/FormInput';
import SelectButton from '../../../components/Buttons/SelectButton';
import classes from './ResidentAdd.module.css'
import ActionButtons from '../../../components/Buttons/ActionButtons';
import ImportPhotoButtons from '../../../components/Buttons/ImportPhotoButtons';
import PicModal from '../../../components/Modals/PicModal';

const ResidentAdd = (props) => {
    const {user} = useAuth()
    const [units, setUnits] = useState([])
    const [loading, setLoading] = useState(true)
    const [residents, setResidents] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [errorAddResidentMessage, setErrorAddResidentMessage] = useState('')
    const [errorAddVehicleMessage, setErrorAddVehicleMessage] = useState('')
    const [vehicleBeingAdded, setVehicleBeingAdded] = useState({id: "0", maker:'', model:'', color:'', plate:''})
    const [userBeingAdded, setUserBeingAdded]= useState({id: "0", name: '', identification: '', email: '', pic: ''})
    const [modalPic, setModalPic] = useState(false)
    const [modalSelectBloco, setModalSelectBloco] = useState(false)
    const [modalSelectUnit, setModalSelectUnit] = useState(false)
    const [selectedBloco, setSelectedBloco] = useState(null)
    const [selectedUnit, setSelectedUnit] = useState(null)
    const [isAddingResident, setIsAddingResident] = useState(false)
    const [isAddingVehicle, setIsAddingVehicle] = useState(false)
    const [takePic, setTakePic] = useState(false)

    

    const treatImage = _ => {
      const img = document.createElement("img");
      img.src = userBeingAdded.pic
      return img.height
    }

    console.log(treatImage())

    const breadcrumb=[
        {
            name: 'Dashboard',
            link: '/'
        },
        {
            name: 'Adicionar Moradores',
            link: '/residents/add'
        }
    ]

    useEffect(()=>{
        api.get(`condo/${user.condo_id}`)
          .then(res=>{
            setUnits(res.data)
            setModalSelectBloco(true)
          })
          .catch(err=>{
            toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA1)', Constants.TOAST_CONFIG)
          })
          .finally(()=>{
            setLoading(false)
          })
    },[])

    const removeResident = index => {
        let residentsCopy = [...residents]
        residentsCopy.splice(index, 1)
        setResidents(residentsCopy)
    }
  
    const removeVehicle = index => {
        const vehiclesCopy = [...vehicles]
        vehiclesCopy.splice(index, 1)
        setVehicles(vehiclesCopy)
    }

    const addResidentHandler = _ =>{
        if(!userBeingAdded.name){
          return setErrorAddResidentMessage('Nome não pode estar vazio.')
        }
        if(!userBeingAdded.email){
          return setErrorAddResidentMessage('Email não pode estar vazio.')
        }
        if(!Utils.validateEmail(userBeingAdded.email)){
          return setErrorAddResidentMessage('Email não é válido.')
        }
        setResidents(prev=> [...prev, userBeingAdded])
        setErrorAddResidentMessage('')
        setUserBeingAdded({id: "0", name: '', identification: '', email: '', pic: ''})
        setIsAddingResident(false)
    }

    const cancelAddResidentHandler = _ => {
      setIsAddingResident(false)
      setUserBeingAdded({id: '0', name: '', identification: '', email: '', pic: ''})
    }

    const addVehicleHandler = _ =>{
        if(!vehicleBeingAdded.maker){
          return setErrorAddVehicleMessage('Fabricante não pode estar vazio.')
        }
        if(!vehicleBeingAdded.model){
          return setErrorAddVehicleMessage('Modelo não pode estar vazio.')
        }
        if(!vehicleBeingAdded.color){
          return setErrorAddVehicleMessage('Cor não pode estar vazia.')
        }
        if(!vehicleBeingAdded.plate){
          return setErrorAddVehicleMessage('Placa não pode estar vazia.')
        }
        if(!Utils.validatePlateFormat(vehicleBeingAdded.plate)){
          return setErrorAddVehicleMessage('Formato de placa inválido.')
        }
        setVehicles(prev=> [...prev, vehicleBeingAdded])
        setErrorAddVehicleMessage('')
        setVehicleBeingAdded({id: '0', maker:'', model:'', color:'', plate:''})
        setIsAddingVehicle(false)
    }

    const cancelVehicleHandler = _ => {
        setVehicleBeingAdded({id: '0', maker:'', model:'', color:'', plate:''})
        setIsAddingVehicle(false)
    }

    const selectBlocoHandler = bloco => {
        setSelectedBloco(bloco)
        setModalSelectBloco(false)
        setModalSelectUnit(true)
    }

    const selectUnitHandler = unit => {
        setSelectedUnit(unit)
        setModalSelectUnit(false)
        setLoading(true)
        api.get(`user/unit/${unit.id}/${Constants.USER_KIND.RESIDENT}`)
          .then(res=>{
            setResidents(res.data)
            console.log('residents', res.data)
            api.get(`vehicle/${unit.id}/${Constants.USER_KIND.RESIDENT}`)
              .then(res2=>{
                setVehicles(res2.data)
                console.log('vehicles', res2.data)
              })
              .catch(err2=>{
                toast.error(err2.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA2)', Constants.TOAST_CONFIG)
                setSelectedUnit(null)
                setSelectedBloco(null)
              })
          })
          .catch(err=>{
            toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA3)', Constants.TOAST_CONFIG)
            setSelectedUnit(null)
            setSelectedBloco(null)
          })
          .finally(()=>{
            setLoading(false)
          })
    }

    const clearUnit = _ =>{
        setSelectedBloco(null)
        setSelectedUnit(null)
    }
  
    const cancelHandler = _ =>{
        clearUnit()
        setResidents([])
        setVehicles([])
    }

    const uploadImgs = newResidents =>{
        const residentsPics = []
        newResidents.forEach(nr => {
          residents.forEach(re => {
            if(nr.email === re.email && 
                nr.name === re.name && 
                nr.identification === re.identification &&
                re.pic != "")
                residentsPics.push({id:nr.id, pic: re.pic})
          })
        })
        residentsPics.forEach(el=>{
          const formData = new FormData()
          formData.append('img', {
            uri: el.pic,
            type: 'image/jpg',
            name:el.id+'.jpg'
          })
          api.post(`user/image/${el.id}`, formData, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            }
          })
          .then(res=>{
            console.log('success', res.data)
          })
          .catch(err=>{
            console.log('error', err.response)
          })
        })
    }

    const confirmHandler = _ =>{
        setLoading(true)
        api.post('vehicle/unit', {
          unit_id: selectedUnit.id,
          vehicles,
          user_id_last_modify: props.route.params.user.id
        })
        .then((res)=>{
          api.post('user/resident/unit', {
            unit_id: selectedUnit.id,
            residents, 
            condo_id: props.route.params.user.condo_id, 
            user_id_last_modify: props.route.params.user.id
          })
            .then(res2=>{
              uploadImgs(res2.data.addedResidents)
              toast.info(res2.data.message, Constants.TOAST_CONFIG)
              setSelectedUnit(null)
              setModalSelectBloco(null)
            })
            .catch(err2=>{
              toast.error(err2.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA4)', Constants.TOAST_CONFIG)
            })
          })
          .catch((err)=>{
            toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA5)', Constants.TOAST_CONFIG)
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
            {/*units*/}
            <SelectButton 
              icon='building'
              text='Selecionar Unidade'
              action={()=>setModalSelectBloco(true)}
            >
              {!!selectedBloco && !!selectedUnit && (
                <ul className="list-group">
                  <li className="list-group-item bg-primary bg-opacity-25 d-flex justify-content-between align-items-start">
                    <span>Bloco {selectedBloco.name} unidade {selectedUnit.number}</span>
                    <span className={classes.CloseIcon} onClick={()=>clearUnit()}><Icon icon='window-close' color={Constants.closeButtonCollor}/></span>
                  </li>
                </ul>
              )}
            </SelectButton>
            {/*residents*/}
            {!!selectedBloco && !!selectedUnit && (
              <SelectButton 
                icon='user'
                text='Adicionar Morador'
                action={()=>setIsAddingResident(true)}
              >
                {isAddingResident && (
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
                        <img src={userBeingAdded.pic} height={120}/>
                      </div>
                    }
                    {!userBeingAdded.pic && 
                      <ImportPhotoButtons 
                        setImgPath={(img)=>setUserBeingAdded({...userBeingAdded, pic: img})} 
                        cameraClick={() => takePicHandler()}/>
                    }
                    {!!errorAddResidentMessage && 
                      <div className="alert alert-danger text-center mt-2" role="alert">
                        {errorAddResidentMessage}
                      </div>
                    }
                    <ActionButtons
                      textButton1='Confirmar'
                      textButton2='Cancelar'
                      action1={()=>addResidentHandler()}
                      action2={()=>cancelAddResidentHandler()}
                    />
                  </form>
                )}
                <ul className="list-group">
                {
                  !!residents.length && residents.map((el, ind)=>(
                    <li className="list-group-item bg-primary bg-opacity-25 d-flex justify-content-between align-items-start" key={el.id + el.name + el.email}>
                      <div className={classes.ResidentBox}>
                        <div className={classes.ResidentImage}>
                          {
                            el.id==='0' ?
                            <ImageBlob path={el.pic} height={100}/>
                            :
                            <Image id={el.id} height={100}/>
                          }
                          
                        </div>
                        <div>
                          <p className={classes.Text}><span className={classes.Bold}>Nome:</span> {el.name}</p>
                          <p className={classes.Text}><span className={classes.Bold}>Email:</span> {el.email}</p>
                        </div>
                      </div>
                      <span className={classes.CloseIcon} onClick={()=>removeResident(ind)}><Icon icon='window-close' color={Constants.closeButtonCollor}/></span>
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
                action={()=>setIsAddingVehicle(true)}
              >
                {isAddingVehicle && (
                  <form className='pb-4'>
                    <FormInput
                      label='Fabricante*:'
                      value={vehicleBeingAdded.maker}
                      changeValue={(val) => setVehicleBeingAdded({...vehicleBeingAdded, maker: val})}
                    />
                    <FormInput
                      label='Modelo*:'
                      value={vehicleBeingAdded.model}
                      changeValue={(val) => setVehicleBeingAdded({...vehicleBeingAdded, model: val})}
                    />
                    <FormInput
                      label='Cor*:'
                      value={vehicleBeingAdded.color}
                      changeValue={(val) => setVehicleBeingAdded({...vehicleBeingAdded, color: val})}
                    />
                    <FormInput
                      label='Placa*:'
                      value={vehicleBeingAdded.plate}
                      changeValue={(val) => setVehicleBeingAdded({...vehicleBeingAdded, plate: val})}
                    />
                    {!!errorAddVehicleMessage && 
                      <div className="alert alert-danger text-center mt-2" role="alert">
                        {errorAddVehicleMessage}
                      </div>
                    }
                    <ActionButtons
                      textButton1='Confirmar'
                      textButton2='Cancelar'
                      action1={()=>addVehicleHandler()}
                      action2={()=>cancelVehicleHandler()}
                    />
                  </form>
                )}
                <ul className="list-group">
                {
                  !!vehicles.length && vehicles.map((el, ind)=>(
                    <li className="list-group-item bg-primary bg-opacity-25 d-flex justify-content-between align-items-start" key={el.id + el.color + el.model + el.plate + el.maker}>
                      <div>
                        <p className={classes.Text}>{el.maker} {el.model} {el.color}</p>
                        <p className={classes.Text}><span className={classes.Bold}>Placa:</span> {el.plate}</p>
                      </div>
                      <span className={classes.CloseIcon} onClick={()=>removeVehicle(ind)}><Icon icon='window-close' color={Constants.closeButtonCollor}/></span>
                    </li>
                  ))
                }
                </ul>
              </SelectButton>
              )
            }
            {
              !!units.length && 
              <BlocoModal
                blocos={units}
                modal={modalSelectBloco}
                toggle={setModalSelectBloco}
                action={(el)=>{selectBlocoHandler(el)}}
              />
            }
            {
              !!selectedBloco && 
              <UnitModal
                bloco={selectedBloco}
                modal={modalSelectUnit}
                toggle={setModalSelectUnit}
                action={(el)=>{selectUnitHandler(el)}}
              />
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
        </Body>
    );
};

export default ResidentAdd;