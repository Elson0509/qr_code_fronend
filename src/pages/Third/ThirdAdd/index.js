import React, { useState, useEffect } from 'react';
import Body from '../../../layout/Body';
import { useAuth } from '../../../contexts/auth'
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
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
import classes from './ThirdAdd.module.css'
import ActionButtons from '../../../components/Buttons/ActionButtons'
import ImportPhotoButtons from '../../../components/Buttons/ImportPhotoButtons'
import PicModal from '../../../components/Modals/PicModal'
import CropImageModal from '../../../components/Modals/CropImageModal';
import QRCodeModal from '../../../components/Modals/QRCodeModal';

const ThirdAdd = (props) => {

    const currentDate = new Date()

    const {user} = useAuth()
    const [units, setUnits] = useState([])
    const [loading, setLoading] = useState(true)
    const [residents, setResidents] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [errorAddResidentMessage, setErrorAddResidentMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [errorSetDateMessage, setErrorSetDateMessage] = useState('')
    const [errorAddVehicleMessage, setErrorAddVehicleMessage] = useState('')
    const [vehicleBeingAdded, setVehicleBeingAdded] = useState({id: "0", maker:'', model:'', color:'', plate:''})
    const [userBeingAdded, setUserBeingAdded]= useState({id: "0", name: '', identification: '', company:'', pic: ''})
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
    const [dateInit, setDateInit] = useState({day: currentDate.getDate(), month: currentDate.getMonth()+1, year: currentDate.getFullYear()})
    const [dateEnd, setDateEnd] = useState({day: currentDate.getDate(), month: currentDate.getMonth()+1, year: currentDate.getFullYear()})
    const [isSelectingDate, setIsSelectingDate] = useState(false)
    const [selectedDateInit, setSelectedDateInit] = useState('')
    const [selectedDateEnd, setSelectedDateEnd] = useState('')
    const [showModalQRCode, setShowModalQRCode] = useState(false)
    const [unitIdModalQRCode, setUnitIdModalQRCode] = useState('')
    const [infoModalQRCode, setInfoModalQRCode] = useState('')


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
            name: 'Adicionar Terceirizados',
            link: '/thirds/add'
        }
    ]

    useEffect(()=>{
        api.get(`condo/${user.condo_id}`)
          .then(res=>{
            setUnits(res.data)
            setModalSelectBloco(true)
          })
          .catch(err=>{
            toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (TA1)', Constants.TOAST_CONFIG)
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
      if(!userBeingAdded.identification){
        return setErrorAddResidentMessage('Documento não pode estar vazio.')
      }
      if(!userBeingAdded.company){
        return setErrorAddResidentMessage('Empresa não pode estar vazia.')
      }
      // if(!userBeingAdded.pic){
      //   return setErrorAddResidentMessage('É necessário adicionar uma foto.')
      // }
      setResidents(prev=> [...prev, userBeingAdded])
      setErrorAddResidentMessage('')
      setUserBeingAdded({id: "0", name: '', identification: '', company:'', pic: ''})
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
      setUserBeingAdded({id: "0", name: '', identification: '', company:'', pic: ''})
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
                re.pic !== "")
                residentsPics.push({id:nr.id, pic: re.pic})
          })
        })
        residentsPics.forEach(el=>{
          //resizing and uploading
          Utils.resizeFile(el.pic).then(data=>{
            api.post(`upload`,{
              base64Image: data,
              fileName: el.id,
              type: 'user'
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
        //checking if there is date selected and at least one third
        if(!selectedDateInit || !selectedDateEnd){
          return setErrorMessage('É preciso selecionar um prazo.')
        }
        if(!residents.length)
          return setErrorMessage('É preciso adicionar terceirizados.')
        setErrorMessage('')
        setLoading(true)
        //storing unit for kind Third
        api.post(`user/person/unit`,{
          residents,
          number: selectedUnit.number,
          vehicles,
          bloco_id: selectedBloco.id,
          selectedDateInit,
          selectedDateEnd,
          unit_kind_id: Constants.USER_KIND.THIRD,
          user_id_last_modify: user.id,
        })
        .then(res=>{
          uploadImgs(res.data.personsAdded)
          toast.info(res.data.message, Constants.TOAST_CONFIG)
          setDateEnd({day: currentDate.getDate(), month: currentDate.getMonth()+1, year: currentDate.getFullYear()})
          //data to QR Code
          setUnitIdModalQRCode(res.data.newUnit.id)
          setInfoModalQRCode(`QR_Code Terceirizado ${selectedBloco.name} ${selectedUnit.number}`)
          setSelectedUnit(null)
          setSelectedBloco(null)
          setResidents([])
          setVehicles([])
          setLoading(false)
          //showing QRCode
          setShowModalQRCode(true)
        })
        .catch(err=>{
          toast.error(err.response.data.message, Constants.TOAST_CONFIG)
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
                text='Adicionar Terceirizados'
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
                      label='Documento*:'
                      value={userBeingAdded.identification}
                      changeValue={(val) => setUserBeingAdded({...userBeingAdded, identification: val})}
                    />
                    <FormInput
                      label='Empresa*:'
                      value={userBeingAdded.company}
                      changeValue={(val) => setUserBeingAdded({...userBeingAdded, company: val})}
                    />
                    {!!userBeingAdded.pic &&
                      <div className={classes.ImgUserTookPic}>
                        <img src={URL.createObjectURL(userBeingAdded.pic)} height={120} alt='user'/>
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
            {!!selectedBloco && !!selectedUnit && !isAddingVehicle && !isAddingResident && !isSelectingDate && (
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

export default ThirdAdd;