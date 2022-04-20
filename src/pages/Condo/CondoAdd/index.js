import React, { useState } from 'react';
import Body from '../../../layout/Body';
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import { Spinner } from 'reactstrap'
import { toast } from 'react-toastify'
import FormInput from '../../../components/Form/FormInput'
import SelectInput from '../../../components/Form/SelectInput';
import ActionButtons from '../../../components/Buttons/ActionButtons'

const CondoAdd = (props) => {
  const [loading, setLoading] = useState(false)
  const [condoBeingAdded, setCondoBeingAdded] = useState({ id: "0", name: '', address: '', city: '', state: '', slots: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [guard_can_messages, setGuard_can_messages] = useState('0')
  const [guard_can_thirds, setGuard_can_thirds] = useState('0')
  const [guard_can_visitors, setGuard_can_visitors] = useState('0')
  const [resident_can_messages, setResident_can_messages] = useState('0')
  const [resident_can_ocorrences, setResident_can_ocorrences] = useState('0')
  const [resident_can_thirds, setResident_can_thirds] = useState('0')
  const [resident_can_visitors, setResident_can_visitors] = useState('0')

  const breadcrumb = [
    {
      name: 'Painel Principal',
      link: '/'
    },
    {
      name: 'Adicionar Condomínio',
      link: '/condo/add'
    }
  ]

  const options = [{ name: 'Sim' }, { name: 'Não' }]

  const addHandler = async _ => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    if (!condoBeingAdded.name) {
      return setErrorMessage('Nome não pode estar vazio.')
    }
    if (!condoBeingAdded.address) {
      return setErrorMessage('Endereço não pode estar vazio.')
    }
    if (!condoBeingAdded.city) {
      return setErrorMessage('Cidade não pode estar vazio.')
    }
    if (!condoBeingAdded.state) {
      return setErrorMessage('Estado não pode estar vazio.')
    }
    if (isNaN(condoBeingAdded.slots) || !condoBeingAdded.slots || Number(condoBeingAdded.slots) < 0) {
      return setErrorMessage('Quantidade de vagas inválida.')
    }

    setLoading(true)
    api.post('condo', {
      name: condoBeingAdded.name,
      address: condoBeingAdded.address,
      city: condoBeingAdded.city,
      state: condoBeingAdded.state,
      slots: condoBeingAdded.slots,
      guard_can_messages: guard_can_messages === '0',
      guard_can_thirds: guard_can_thirds === '0',
      guard_can_visitors: guard_can_visitors === '0',
      resident_can_messages: resident_can_messages === '0',
      resident_can_ocorrences: resident_can_ocorrences === '0',
      resident_can_thirds: resident_can_thirds === '0',
      resident_can_visitors: resident_can_visitors === '0',
    })
      .then((res) => {
        setErrorMessage('')
        props.history.push('/condo/list')
        toast.info('Cadastro realizado', Constants.TOAST_CONFIG)
        setCondoBeingAdded({ id: "0", name: '', address: '', city: '', state: '', slots: '' })
      })
      .catch((err) => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CoA1)', Constants.TOAST_CONFIG)
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
      <form className='pb-4'>
        <FormInput
          label='Nome*:'
          value={condoBeingAdded.name}
          changeValue={(val) => setCondoBeingAdded({ ...condoBeingAdded, name: val })}
        />
        <FormInput
          label='Endereço*:'
          value={condoBeingAdded.address}
          changeValue={(val) => setCondoBeingAdded({ ...condoBeingAdded, address: val })}
        />
        <FormInput
          label='Cidade*:'
          value={condoBeingAdded.city}
          changeValue={(val) => Utils.testWordWithNoSpecialChars(val) && setCondoBeingAdded({ ...condoBeingAdded, city: val })}
        />
        <FormInput
          label='Estado*:'
          value={condoBeingAdded.state}
          changeValue={(val) => Utils.testWordWithNoSpecialChars(val) && setCondoBeingAdded({ ...condoBeingAdded, state: val })}
        />
        <FormInput
          label='Vagas de estacionamento*:'
          type='number'
          value={condoBeingAdded.slots}
          changeValue={(val) => setCondoBeingAdded({ ...condoBeingAdded, slots: val })}
        />
        <h4 className='mt-4 text-center'>Permissões</h4>
        <div className='row'>
          <div className='col'>
            <h5>Colaboradores</h5>
            <SelectInput
              label='Pode enviar mensagens?'
              value={guard_can_messages}
              changeValue={(val) => setGuard_can_messages(val)}
              options={options}
            />
            <SelectInput
              label='Pode cadastrar terceirizados?'
              value={guard_can_thirds}
              changeValue={(val) => setGuard_can_thirds(val)}
              options={options}
            />
            <SelectInput
              label='Pode cadastrar visitantes?'
              value={guard_can_visitors}
              changeValue={(val) => setGuard_can_visitors(val)}
              options={options}
            />
          </div>
        </div>
        <div className='row mt-4'>
          <div className='col'>
            <h5>Moradores</h5>
            <SelectInput
              label='Pode enviar mensagens?'
              value={resident_can_messages}
              changeValue={(val) => setResident_can_messages(val)}
              options={options}
            />
            <SelectInput
              label='Pode cadastrar terceirizados?'
              value={resident_can_thirds}
              changeValue={(val) => setResident_can_thirds(val)}
              options={options}
            />
            <SelectInput
              label='Pode cadastrar visitantes?'
              value={resident_can_visitors}
              changeValue={(val) => setResident_can_visitors(val)}
              options={options}
            />
            <SelectInput
              label='Pode cadastrar ocorrências?'
              value={resident_can_ocorrences}
              changeValue={(val) => setResident_can_ocorrences(val)}
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
          action1={() => addHandler()}
          action2={() => { props.history.push('/dashboard') }}
        />
      </form>
    </Body>
  );
};

export default CondoAdd;