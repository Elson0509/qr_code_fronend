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
import InputDate from '../../../components/Form/InputDate';
import SelectButton from '../../../components/Buttons/SelectButton'
import classes from './VisitorEdit.module.css'
import ActionButtons from '../../../components/Buttons/ActionButtons'
import ImportPhotoButtons from '../../../components/Buttons/ImportPhotoButtons'
import PicModal from '../../../components/Modals/PicModal'
import CropImageModal from '../../../components/Modals/CropImageModal';
import QRCodeModal from '../../../components/Modals/QRCodeModal';

const VisitorEdit = (props) => {
    //if there is not state in router, go to dashboard
    if(!props.location?.state?.residents){
      props.history.push('/dashboard')
    }    

    const currentDate = new Date()

    const {user} = useAuth()
    const [units, setUnits] = useState([])
    const [loading, setLoading] = useState(true)
    const [residents, setResidents] = useState(props.location.state.residents)
    const [vehicles, setVehicles] = useState(props.location.state.vehicles)
    const [errorAddResidentMessage, setErrorAddResidentMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [errorSetDateMessage, setErrorSetDateMessage] = useState('')
    const [errorAddVehicleMessage, setErrorAddVehicleMessage] = useState('')
    const [vehicleBeingAdded, setVehicleBeingAdded] = useState({id: "0", maker:'', model:'', color:'', plate:''})
    const [userBeingAdded, setUserBeingAdded]= useState({id: "0", name: '', identification: '', pic: ''})
    const [modalPic, setModalPic] = useState(false)
    const [modalCrop, setModalCrop] = useState(false)
    const [modalSelectBloco, setModalSelectBloco] = useState(false)
    const [modalSelectUnit, setModalSelectUnit] = useState(false)
    const [selectedBloco, setSelectedBloco] = useState(props.location.state.selectedBloco)
    const [selectedUnit, setSelectedUnit] = useState(props.location.state.selectedUnit)
    const [isAddingResident, setIsAddingResident] = useState(false)
    const [isAddingVehicle, setIsAddingVehicle] = useState(false)
    const [takePic, setTakePic] = useState(false)
    const [pathImgToCrop, setPathImgToCrop] = useState('')
    const [dateInit, setDateInit] = useState({day: currentDate.getDate(), month: currentDate.getMonth()+1, year: currentDate.getFullYear()})
    const [dateEnd, setDateEnd] = useState({day: currentDate.getDate(), month: currentDate.getMonth()+1, year: currentDate.getFullYear()})
    const [isSelectingDate, setIsSelectingDate] = useState(false)
    const [selectedDateInit, setSelectedDateInit] = useState(new Date(props.location.state.residents[0].initial_date))
    const [selectedDateEnd, setSelectedDateEnd] = useState(new Date(props.location.state.residents[0].final_date))
    const [showModalQRCode, setShowModalQRCode] = useState(false)
    const [unitIdModalQRCode, setUnitIdModalQRCode] = useState('')
    const [infoModalQRCode, setInfoModalQRCode] = useState('')


    const paperClipImageHandler = imgPath => {
      setPathImgToCrop(imgPath)
      setModalCrop(true)
    }

    const breadcrumb=[
        {
            name: 'Dashboard',
            link: '/'
        },
        {
            name: 'Editar Visitantes',
            link: '/visitors/edit'
        }
    ]

    useEffect(()=>{
        api.get(`condo/${user.condo_id}`)
          .then(res=>{
            setUnits(res.data)
          })
          .catch(err=>{
            toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA1)', Constants.TOAST_CONFIG)
          })
          .finally(()=>{
            setLoading(false)
          })
    },[])

    const closeModalCropHandler = _ => {
      setPathImgToCrop('')
      setModalCrop('')
    }

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
        setResidents(prev=> [...prev, userBeingAdded])
        setErrorAddResidentMessage('')
        setUserBeingAdded({id: "0", name: '', identification: '', pic: ''})
        setIsAddingResident(false)
    }

    const selectDatesHandler = _ =>{
      if(!Utils.isValidDate(dateInit.day, dateInit.month, dateInit.year) ){
        return setErrorSetDateMessage('Data inicial não é válida.')
      }
      if(!Utils.isValidDate(dateEnd.day, dateEnd.month, dateEnd.year) ){
        return setErrorSetDateMessage('Data final não é válida.')
      }
      const dateInicial = new Date(dateInit.year, dateInit.month-1, dateInit.day)
      const dateFinal = new Date(dateEnd.year, dateEnd.month-1, dateEnd.day)
      if(dateFinal<dateInicial){
        return setErrorSetDateMessage('Data final precisa ser posterior à data inicial')
      }
      setErrorSetDateMessage('')
      setSelectedDateInit(dateInicial)
      setSelectedDateEnd(dateFinal)
      setIsSelectingDate(false)
    }

    const cancelDatesHandler = _ =>{
      setSelectedDateInit('')
      setSelectedDateEnd('')
    }

    const cancelAddResidentHandler = _ => {
      setIsAddingResident(false)
      setUserBeingAdded({id: '0', name: '', identification: '', pic: ''})
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
    }

    const clearUnit = _ =>{
        setSelectedBloco(null)
        setSelectedUnit(null)
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
          //resizing and uploading
          Utils.resizeFile(el.pic).then(data=>{
            api.post(`upload`,{
              base64Image: data,
              fileName: el.id
            })
            .then(res=>{
              console.log('success', res.data)
            })
            .catch(err=>{
              console.log('error', err.response)
            })
          })
          
        })
    }

    const confirmHandler = _ =>{
        //checking if there is date selected and at least one visitor
        if(!selectedDateInit || !selectedDateEnd){
          return setErrorMessage('É preciso selecionar um prazo.')
        }
        if(!residents.length)
          return setErrorMessage('É preciso adicionar visitantes.')
        setErrorMessage('')
        setLoading(true)
        //storing unit for kind Visitor
        api.put(`user/person`,{
          residents,
          unit_id: selectedUnit.id,
          selectedDateInit,
          selectedDateEnd,
          unit_kind_id: Constants.USER_KIND.VISITOR,
          user_id_last_modify: user.id,
          condo_id: user.condo_id,
        })
        .then(res=>{
          uploadImgs(res.data.addedResidents)
          api.post('vehicle/unit', {
            unit_id: selectedUnit.id,
            vehicles,
            user_id_last_modify: user.id,
          })
          .then(res2=>{
            toast.info(res2.data.message, Constants.TOAST_CONFIG)
            setSelectedUnit(null)
            setSelectedBloco(null)
            setResidents([])
            setVehicles([])
            setLoading(false)
          })
          .catch(err2=>{
            toast.error(err2.response.data.message || 'Um erro ocorreu. Tente mais tarde. (VE2)', Constants.TOAST_CONFIG)
          })
        })
        .catch(err=>{
          toast.error(err.response.data.message || 'Um erro ocorreu. Tente mais tarde. (VE3)', Constants.TOAST_CONFIG)
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
                text='Adicionar Visitantes'
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
                          {!!el.name && <p className={classes.Text}><span className={classes.Bold}>Nome:</span> {el.name}</p>}
                          {!!el.email && <p className={classes.Text}><span className={classes.Bold}>Email:</span> {el.email}</p>}
                          {!!el.identification && <p className={classes.Text}><span className={classes.Bold}>Id:</span> {el.identification}</p>}
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
            {/*dates*/}
            {!!selectedBloco && !!selectedUnit && (
              <SelectButton 
                icon='calendar'
                text='Selecionar período'
                action={()=>setIsSelectingDate(true)}
              >
                {isSelectingDate && (
                  <form>
                    <InputDate
                      title='Data Inicial'
                      date={dateInit}
                      setDate={setDateInit}
                    />
                    <InputDate
                      title='Data Final'
                      date={dateEnd}
                      setDate={setDateEnd}
                    />
                    {errorSetDateMessage && 
                      <div className="alert alert-danger text-center" role="alert">
                        {errorSetDateMessage}
                      </div>
                    }
                    <ActionButtons
                      textButton1='Confirmar'
                      textButton2='Cancelar'
                      action1={()=>selectDatesHandler()}
                      action2={()=>setIsSelectingDate(false)}
                    />
                  </form>
                )}
                {!!selectedDateInit && !!selectedDateEnd && (
                <ul className="list-group">
                  <li className="list-group-item bg-primary bg-opacity-25 d-flex justify-content-between align-items-start">
                    <div>
                      <p className='m-0 p-0'><span className='enfase'>Data inicial: </span>{Utils.printDate(selectedDateInit)}</p>
                      <p className='m-0 p-0'><span className='enfase'>Data final: </span>{Utils.printDate(selectedDateEnd)}</p>
                    </div>
                    <span className={classes.CloseIcon} onClick={()=>cancelDatesHandler()}><Icon icon='window-close' color={Constants.closeButtonCollor}/></span>
                  </li>
                </ul>
              )}
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
            {!!selectedBloco && !!selectedUnit && (
              <ActionButtons
                errorMessage={errorMessage}
                textButton1='Cadastrar'
                textButton2='Cancelar'
                action1={()=>confirmHandler()}
                action2={()=>props.history.push('/dashboard')}
              />
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
            {showModalQRCode &&
              <QRCodeModal
                modal={showModalQRCode}
                toggle={()=>setShowModalQRCode(false)}
                id={unitIdModalQRCode}
                info={infoModalQRCode}
              />
            }
        </Body>
    );
};

export default VisitorEdit;