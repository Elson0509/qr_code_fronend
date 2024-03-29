import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true)
  const [condoBeingAdded, setCondoBeingAdded] = useState({ id: "0", name: '', address: '', city: '', state: '', slots: '', partner_id: 0 })
  const [errorMessage, setErrorMessage] = useState('')
  const [partners, setPartners] = useState([])
  const [guard_can_messages, setGuard_can_messages] = useState('0')
  const [guard_can_thirds, setGuard_can_thirds] = useState('0')
  const [guard_can_visitors, setGuard_can_visitors] = useState('0')
  const [resident_can_messages, setResident_can_messages] = useState('0')
  const [resident_can_ocorrences, setResident_can_ocorrences] = useState('0')
  const [resident_can_thirds, setResident_can_thirds] = useState('0')
  const [resident_can_visitors, setResident_can_visitors] = useState('0')
  const [resident_has_dob, setResident_has_dob] = useState('0')
  const [resident_has_owner_field, setResident_has_owner_field] = useState('0')
  const [resident_has_phone, setResident_has_phone] = useState('0')
  const [guard_see_dob, setGuard_see_dob] = useState('0')
  const [guard_see_phone, setGuard_see_phone] = useState('0')
  const [condo_has_classifieds, setCondo_has_classifieds] = useState('0')
  const [condo_has_guard_routes, setCondo_has_guard_routes] = useState('0')
  const [condo_has_mail, setCondo_has_mail] = useState('0')
  const [condo_has_news, setCondo_has_news] = useState('0')
  const [condo_has_reservations, setCondo_has_reservations] = useState('0')

  useEffect(() => {
    api.get('partner')
      .then(resp => {
        setPartners(resp.data)
      })
      .catch(err => {
        setErrorMessage(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CoA1)')
      }
      ).finally(() => {
        setLoading(false)
      })
  }, [])

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
      partner_id: condoBeingAdded.partner_id,
      guard_can_messages: guard_can_messages === '0',
      guard_can_thirds: guard_can_thirds === '0',
      guard_can_visitors: guard_can_visitors === '0',
      resident_can_messages: resident_can_messages === '0',
      resident_can_ocorrences: resident_can_ocorrences === '0',
      resident_can_thirds: resident_can_thirds === '0',
      resident_can_visitors: resident_can_visitors === '0',
      resident_has_dob: resident_has_dob === '0',
      resident_has_owner_field: resident_has_owner_field === '0',
      resident_has_phone: resident_has_phone === '0',
      guard_see_dob: guard_see_dob === '0',
      guard_see_phone: guard_see_phone === '0',
      condo_has_classifieds: condo_has_classifieds === '0',
      condo_has_guard_routes: condo_has_guard_routes === '0',
      condo_has_mail: condo_has_mail === '0',
      condo_has_news: condo_has_news === '0',
      condo_has_reservations: condo_has_reservations === '0',
    })
      .then((res) => {
        setErrorMessage('')
        props.history.push('/condo/list')
        toast.info('Cadastro realizado', Constants.TOAST_CONFIG)
        setCondoBeingAdded({ id: "0", name: '', address: '', city: '', state: '', slots: '' })
      })
      .catch((err) => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CoA2)', Constants.TOAST_CONFIG)
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
              label='Pode receber mensagens?'
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
            <SelectInput
              label='Podem ver telefone de moradores?'
              value={guard_see_phone}
              changeValue={(val) => setGuard_see_phone(val)}
              options={options}
            />
            <SelectInput
              label='Podem ver nascimento de moradores?'
              value={guard_see_dob}
              changeValue={(val) => setGuard_see_dob(val)}
              options={options}
            />
          </div>
        </div>
        <div className='row mt-4'>
          <div className='col'>
            <h5>Moradores</h5>
            <SelectInput
              label='Pode receber mensagens?'
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
            <SelectInput
              label='Possuem campo de alugado/dono?'
              value={resident_has_owner_field}
              changeValue={(val) => setResident_has_owner_field(val)}
              options={options}
            />
            <SelectInput
              label='Possuem telefone?'
              value={resident_has_phone}
              changeValue={(val) => setResident_has_phone(val)}
              options={options}
            />
            <SelectInput
              label='Possuem data de nascimento?'
              value={resident_has_dob}
              changeValue={(val) => setResident_has_dob(val)}
              options={options}
            />
          </div>
        </div>
        <div className='row mt-4'>
          <div className='col'>
            <h5>Condomínio</h5>
            <SelectInput
              label='Possui controle de correspondência?'
              value={condo_has_mail}
              changeValue={(val) => setCondo_has_mail(val)}
              options={options}
            />
            <SelectInput
              label='Possui classificados?'
              value={condo_has_classifieds}
              changeValue={(val) => setCondo_has_classifieds(val)}
              options={options}
            />
            <SelectInput
              label='Possui ronda de vigilantes?'
              value={condo_has_guard_routes}
              changeValue={(val) => setCondo_has_guard_routes(val)}
              options={options}
            />
            <SelectInput
              label='Possui avisos?'
              value={condo_has_news}
              changeValue={(val) => setCondo_has_news(val)}
              options={options}
            />
            <SelectInput
              label='Possui reservas?'
              value={condo_has_reservations}
              changeValue={(val) => setCondo_has_reservations(val)}
              options={options}
            />
          </div>
        </div>
        <div className='row mt-4'>
          <div className='col'>
            <h5>Parcerias</h5>
            <div className="form-group mt-2">
              <label>Possui parceria?</label>
              <select 
                className="form-control" 
                value={condoBeingAdded.partner_id}
                onChange={(ev) => setCondoBeingAdded({...condoBeingAdded, partner_id:ev.target.value})}>
                <option value={0}>Não</option>
                {
                  partners.map(el => (
                    <option key={el.id} value={el.id}>{el.name}</option>
                  ))
                }
              </select>
            </div>
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