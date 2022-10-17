import React, { useState, useEffect } from 'react'
import Body from '../../../layout/Body'
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import { useAuth } from '../../../contexts/auth'
import api from '../../../services/api'
import ConfirmModal from '../../../components/Modals/ConfirmModal'
import { Alert, Spinner } from 'reactstrap'
import { toast } from 'react-toastify'
import ButtonIcon from '../../../components/Buttons/ButtonIcon'
import GeneralCard from '../../../components/GeneralCard'
import FormInput from '../../../components/Form/FormInput'
import ImageCloud from '../../../components/ImageCloud'
import ActionButtons from '../../../components/Buttons/ActionButtons'
import SelectInput from '../../../components/Form/SelectInput'
import FormComment from '../../../components/Form/FormComment'

const Mail = (props) => {

  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  const [mails, setMails] = useState([])
  const [filter, setFilter] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const [selectedMail, setSelectedMail] = useState(null)
  const [mailStatus, setMailStatus] = useState(1)
  const [modalClarify, setModalClarify] = useState(false)
  const [selectedResident, setSelectedResident] = useState(0)
  const [newStatus, setNewStatus] = useState('Entregue')
  const [notes_after_delivered, setNotes_after_delivered] = useState('')

  const breadcrumb = [
    {
      name: 'Painel Principal',
      link: '/'
    },
    {
      name: 'Correios',
      link: '/services/maillist'
    }
  ]

  useEffect(() => {
    fetchMails()
  }, [])

  const fetchMails = async () => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    api.get(`mail`)
      .then(resp => {
        setMails(resp.data)
      })
      .catch(err => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (ML1)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const filterData = () => {
    let tempList = [...mails]
    if (!!filter) {
      tempList = tempList.filter(el => {
        return el.tracking_code.toLowerCase().indexOf(Utils.removeAccent(filter.toLowerCase())) !== -1 ||
          Utils.removeAccent(el.notes.toLowerCase()).indexOf(Utils.removeAccent(filter.toLowerCase())) !== -1 ||
          Utils.printDateAndHour(new Date(el.createdAt)).indexOf(Utils.removeAccent(filter.toLowerCase())) !== -1
      })
    }
    return tempList.filter(el => el.status === mailStatus)
  }

  const classifyMailHandler = mail => {
    setSelectedMail(mail)
    setModalClarify(true)
    console.log(mail)
  }

  const deleteMailHandler = mail => {
    setSelectedMail(mail)
    setModalMessage(true)
  }

  const confirmDelHandler = () => {
    setModalMessage(false)
    setLoading(true)
    api.delete(`mail/${selectedMail.id}`)
      .then(() => {
        toast.info('Correspondência apagada!')
        fetchMails()
      })
      .catch((err) => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (MLD1)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  console.log(filterData())

  const confirmClarifyHandler = async () => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    setLoading(true)
    api.post(`mail/${selectedMail.id}`,
      {
        status: newStatus === 'Entregue' ? Constants.MAIL_STATUS['Entregue'] : Constants.MAIL_STATUS['Recusado'],
        delivered_to_user_id: selectedResident === 0 ? null : selectedMail.Unit.Users[selectedResident - 1].id,
        notes_after_delivered
      }
    )
      .then(() => {
        toast.info('Baixa confirmada!')
        setModalClarify(false)
        fetchMails()
        setSelectedResident(0)
        setNewStatus('Entregue')
        setNotes_after_delivered('')
      })
      .catch(err => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (MDel1)', Constants.TOAST_CONFIG)
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
        <div>
          <ButtonIcon
            newClass='btn-primary'
            iconSize='lg'
            text='Receber correspondência'
            clicked={() => props.history.push('/services/mailadd')}
            icon='folder-plus'
            
          />
        </div>
        <div>
          <ul className="nav justify-content-center">
            <ButtonIcon
              newClass='btn-light btn-outline-dark'
              iconSize='lg'
              text='Em espera'
              clicked={() => setMailStatus(Constants.MAIL_STATUS['Em espera'])}
              icon='clock'
              iconColor='black'
            />
            <ButtonIcon
              newClass='btn-light btn-outline-dark'
              iconSize='lg'
              text='Coletadas'
              clicked={() => setMailStatus(Constants.MAIL_STATUS['Entregue'])}
              icon='check-double'
              iconColor='black'
            />
            <ButtonIcon
              newClass='btn-light btn-outline-dark'
              iconSize='lg'
              text='Negadas'
              clicked={() => setMailStatus(Constants.MAIL_STATUS['Recusado'])}
              icon='close'
              iconColor='black'
            />
          </ul>
        </div>
        <div className='mb-4'>
          <FormInput
            placeholder='Pesquisar'
            value={filter}
            changeValue={value => setFilter(value)}
          />
        </div>
        {
          !!filterData().length &&
          filterData().map(el => (
            <GeneralCard
              key={el.id}
              bgColor='bg-light'
            >
              <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
                <ImageCloud id={el.photo_id} isParcel height='auto' width={200} />
              </div>
              <p className='p-0 m-0'><span className='enfase'> Rastreio: </span> {el.tracking_code}</p>
              <p className='p-0 m-0'><span className='enfase'> Data: </span> {Utils.printDateAndHour(new Date(el.createdAt))}</p>
              {
                !!el.notes &&
                <p className='p-0 m-0'><span className='enfase'> Obs: </span> {el.notes}</p>
              }
              {
                !!el.notes_after_delivered && el.status !== Constants.MAIL_STATUS['Em espera'] &&
                <p className='p-0 m-0'><span className='enfase'> Obs de baixa: </span> {el.notes_after_delivered}</p>
              }
              {
                user.user_kind !== Constants.USER_KIND['RESIDENT'] &&
                <p className='p-0 m-0'><span className='enfase'> Unidade: </span> Bloco {el.Unit.Bloco.name} Unidade {el.Unit.number}</p>
              }
              {
                user.user_kind === Constants.USER_KIND['SUPERINTENDENT'] && el.status === Constants.MAIL_STATUS['Em espera'] &&
                <ActionButtons
                  textButton2='Excluir'
                  textButton1='Dar baixa'
                  action1={() => classifyMailHandler(el)}
                  action2={() => deleteMailHandler(el)}
                />
              }
            </GeneralCard>
          ))
        }
      </div>
      <ConfirmModal
        message='Deseja realmente apagar esta correspondência?'
        modal={modalMessage}
        toggle={() => setModalMessage(false)}
        title='Confirme'
        action1={() => { confirmDelHandler() }}
      />
      {
        !!selectedMail &&
        <ConfirmModal
          modal={modalClarify}
          toggle={() => setModalClarify(false)}
          title={`Baixa em ${selectedMail.tracking_code}`}
          action1={confirmClarifyHandler}
        >
          <SelectInput
            label='Selecionar morador:'
            value={selectedResident}
            options={[{ name: '' }].concat(selectedMail.Unit.Users)}
            changeValue={value => setSelectedResident(value)}
          />
          <label className='mt-2'>Novo Status:</label>
          <ButtonIcon
            text={newStatus}
            newClass='col-12 btn-light btn-outline-dark'
            clicked={() => { setNewStatus(prev => prev === 'Entregue' ? 'Recusado' : 'Entregue') }}
          />
          <FormComment
            label='Observação'
            value={notes_after_delivered}
            changeValue={val => setNotes_after_delivered(val)}
          />
        </ConfirmModal>
      }
    </Body>
  )
}

export default Mail