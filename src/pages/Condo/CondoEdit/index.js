import React, { useState} from 'react';
import Body from '../../../layout/Body';
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import { Spinner } from 'reactstrap'
import { toast } from 'react-toastify'
import FormInput from '../../../components/Form/FormInput'
import ActionButtons from '../../../components/Buttons/ActionButtons'

const CondoEdit = (props) => {
  //if there is not state in router, go to dashboard
  if(!props.location?.state?.condoBeingAdded){
    props.history.push('/dashboard')
  }

  const [loading, setLoading] = useState(false)
  const [condoBeingAdded, setCondoBeingAdded] = useState(props.location.state?.condoBeingAdded)
  const [errorMessage, setErrorMessage] = useState('')  

  const breadcrumb=[
      {
          name: 'Painel Principal',
          link: '/'
      },
      {
          name: 'Editar Condomínio',
          link: '/condo/edit'
      }
  ]

  const addHandler = async _ => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    if(!condoBeingAdded.name){
      return setErrorMessage('Nome não pode estar vazio.')
    }
    if(!condoBeingAdded.address){
      return setErrorMessage('Endereço não pode estar vazio.')
    }
    if(!condoBeingAdded.city){
      return setErrorMessage('Cidade não pode estar vazio.')
    }
    if(!condoBeingAdded.state){
      return setErrorMessage('Estado não pode estar vazio.')
    }
    if(isNaN(condoBeingAdded.slots) || !condoBeingAdded.slots || Number(condoBeingAdded.slots) < 0){
      return setErrorMessage('Quantidade de vagas inválida.')
    }
    setLoading(true)
    api.put(`condo/${condoBeingAdded.id}`, {
      name: condoBeingAdded.name,
      address: condoBeingAdded.address,
      city: condoBeingAdded.city,
      state: condoBeingAdded.state,
      slots: condoBeingAdded.slots,
    })
    .then((res)=>{
      setErrorMessage('')
      toast.info('Cadastro realizado', Constants.TOAST_CONFIG)
      props.history.goBack() 
    })
    .catch((err)=> {
      Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CoE1)', Constants.TOAST_CONFIG)
    })
    .finally(()=>{
      setLoading(false)
    })
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
      <form className='pb-4'>
        <FormInput
          label='Nome*:'
          value={condoBeingAdded?.name}
          changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, name: val})}
        />
        <FormInput
          label='Endereço*:'
          value={condoBeingAdded?.address}
          changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, address: val})}
        />
        <FormInput
          label='Cidade*:'
          value={condoBeingAdded?.city}
          changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, city: val})}
        />
        <FormInput
          label='Estado*:'
          value={condoBeingAdded?.state}
          changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, state: val})}
        />
        <FormInput
            label='Vagas de estacionamento*:'
            type='number'
            value={condoBeingAdded.slots}
            changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, slots: val})}
        />
        {!!errorMessage && 
          <div className="alert alert-danger text-center mt-2" role="alert">
            {errorMessage}
          </div>
        }
        <ActionButtons
          textButton1='Confirmar'
          textButton2='Cancelar'
          action1={()=>addHandler()}
          action2={()=>{props.history.push('/dashboard')}}
        />
      </form>
    </Body>
  );
};

export default CondoEdit;