import React, { useState} from 'react';
import Body from '../../../layout/Body';
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import { Spinner } from 'reactstrap'
import { toast } from 'react-toastify'
import FormInput from '../../../components/Form/FormInput'
import ActionButtons from '../../../components/Buttons/ActionButtons'
import SelectInput from '../../../components/Form/SelectInput';

const CondoEdit = (props) => {
  //if there is not state in router, go to dashboard
  if(!props.location?.state?.condoBeingAdded){
    props.history.push('/dashboard')
  }

  const newCondo  = {}
  Object.keys(props.location.state.condoBeingAdded).forEach(key => {
    if(typeof props.location.state.condoBeingAdded[key] === 'boolean'){
      newCondo[key] = props.location.state.condoBeingAdded[key] ? '0' : '1'
    }
    else{
      newCondo[key] = props.location.state.condoBeingAdded[key]
    }
  })

  const [loading, setLoading] = useState(false)
  const [condoBeingAdded, setCondoBeingAdded] = useState(newCondo)
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

  const options = [{ name: 'Sim' }, { name: 'Não' }]

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
      guard_can_messages: condoBeingAdded.guard_can_messages === '0',
      guard_can_thirds: condoBeingAdded.guard_can_thirds === '0',
      guard_can_visitors: condoBeingAdded.guard_can_visitors === '0',
      resident_can_messages: condoBeingAdded.resident_can_messages === '0',
      resident_can_ocorrences: condoBeingAdded.resident_can_ocorrences === '0',
      resident_can_thirds: condoBeingAdded.resident_can_thirds === '0',
      resident_can_visitors: condoBeingAdded.resident_can_visitors === '0',
      resident_has_dob: condoBeingAdded.resident_has_dob === '0',
      resident_has_phone: condoBeingAdded.resident_has_phone === '0',
      guard_see_dob: condoBeingAdded.guard_see_dob === '0',
      guard_see_phone: condoBeingAdded.guard_see_phone === '0',
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
          changeValue={(val) => Utils.testWordWithNoSpecialChars(val) && setCondoBeingAdded({...condoBeingAdded, name: val})}
        />
        <FormInput
          label='Endereço*:'
          value={condoBeingAdded?.address}
          changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, address: val})}
        />
        <FormInput
          label='Cidade*:'
          value={condoBeingAdded?.city}
          changeValue={(val) => Utils.testWordWithNoSpecialChars(val) && setCondoBeingAdded({...condoBeingAdded, city: val})}
        />
        <FormInput
          label='Estado*:'
          value={condoBeingAdded?.state}
          changeValue={(val) => Utils.testWordWithNoSpecialChars(val) && setCondoBeingAdded({...condoBeingAdded, state: val})}
        />
        <FormInput
            label='Vagas de estacionamento*:'
            type='number'
            value={condoBeingAdded.slots}
            changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, slots: val})}
        />
        <h4 className='mt-4 text-center'>Permissões</h4>
        <div className='row'>
          <div className='col'>
            <h5>Colaboradores</h5>
            <SelectInput
              label='Pode enviar mensagens?'
              value={condoBeingAdded.guard_can_messages}
              changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, guard_can_messages: val})}
              options={options}
            />
            <SelectInput
              label='Pode cadastrar terceirizados?'
              value={condoBeingAdded.guard_can_thirds}
              changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, guard_can_thirds: val})}
              options={options}
            />
            <SelectInput
              label='Pode cadastrar visitantes?'
              value={condoBeingAdded.guard_can_visitors}
              changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, guard_can_visitors: val})}
              options={options}
            />
                        <SelectInput
              label='Podem ver telefone de moradores?'
              value={condoBeingAdded.guard_see_phone}
              changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, guard_see_phone: val})}
              options={options}
            />
            <SelectInput
              label='Podem ver nascimento de moradores?'
              value={condoBeingAdded.guard_see_dob}
              changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, guard_see_dob: val})}
              options={options}
            />
          </div>
        </div>
        <div className='row mt-4'>
          <div className='col'>
            <h5>Moradores</h5>
            <SelectInput
              label='Pode enviar mensagens?'
              value={condoBeingAdded.resident_can_messages}
              changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, resident_can_messages: val})}
              options={options}
            />
            <SelectInput
              label='Pode cadastrar terceirizados?'
              value={condoBeingAdded.resident_can_thirds}
              changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, resident_can_thirds: val})}
              options={options}
            />
            <SelectInput
              label='Pode cadastrar visitantes?'
              value={condoBeingAdded.resident_can_visitors}
              changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, resident_can_visitors: val})}
              options={options}
            />
            <SelectInput
              label='Pode cadastrar ocorrências?'
              value={condoBeingAdded.resident_can_ocorrences}
              changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, resident_can_ocorrences: val})}
              options={options}
            />
            <SelectInput
              label='Possuem telefone?'
              value={condoBeingAdded.resident_has_phone}
              changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, resident_has_phone: val})}
              options={options}
            />
            <SelectInput
              label='Possuem data de nascimento?'
              value={condoBeingAdded.resident_has_dob}
              changeValue={(val) => setCondoBeingAdded({...condoBeingAdded, resident_has_dob: val})}
              options={options}
            />
          </div>
        </div>
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