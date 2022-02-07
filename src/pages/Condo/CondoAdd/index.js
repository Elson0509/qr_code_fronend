import React, { useState} from 'react';
import Body from '../../../layout/Body';
import * as Constants from '../../../services/constants'
import api from '../../../services/api'
import { Spinner } from 'reactstrap'
import { toast } from 'react-toastify'
import FormInput from '../../../components/Form/FormInput'
import ActionButtons from '../../../components/Buttons/ActionButtons'

const CondoAdd = (props) => {
    const [loading, setLoading] = useState(false)
    const [condoBeingAdded, setCondoBeingAdded] = useState({id: "0", name: '', address: '', city: '', state: '', slots: ''})
    const [errorMessage, setErrorMessage] = useState('')  

    const breadcrumb=[
        {
            name: 'Painel Principal',
            link: '/'
        },
        {
            name: 'Adicionar Condomínio',
            link: '/condo/add'
        }
    ]

    const addHandler = _ => {
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
      api.post('condo', {
        name: condoBeingAdded.name,
        address: condoBeingAdded.address,
        city: condoBeingAdded.city,
        state: condoBeingAdded.state,
        slots: condoBeingAdded.slots,
      })
      .then((res)=>{
        setErrorMessage('')
        toast.info('Cadastro realizado', Constants.TOAST_CONFIG)
        setCondoBeingAdded({id: "0", name: '', address: '', city: '', state: '', slots: ''})
      })
      .catch((err)=> {
        toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CoA1)', Constants.TOAST_CONFIG)
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
            value={condoBeingAdded.name}
            changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, name: val})}
          />
          <FormInput
            label='Endereço*:'
            value={condoBeingAdded.address}
            changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, address: val})}
          />
          <FormInput
            label='Cidade*:'
            value={condoBeingAdded.city}
            changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, city: val})}
          />
          <FormInput
            label='Estado*:'
            value={condoBeingAdded.state}
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

export default CondoAdd;