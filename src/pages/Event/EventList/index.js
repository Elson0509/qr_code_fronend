import React, { useState, useEffect, useRef } from 'react'
import Body from '../../../layout/Body'
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import { useAuth } from '../../../contexts/auth'
import api from '../../../services/api'
import IconButtons from '../../../components/Buttons/IconButtons'
import ConfirmModal from '../../../components/Modals/ConfirmModal'
import ImageModal from '../../../components/Modals/ImageModal'
import logo from '../../../Images/logo-h-min.jpg'
import { Spinner } from 'reactstrap'
import { toast } from 'react-toastify'
import Pagination from '../../../components/Pagination'
import classes from './index.module.css'
import Icon from '../../../components/Icon'
import ActionButtons from '../../../components/Buttons/ActionButtons'
import {
  Card, CardBody, CardHeader,
} from 'reactstrap';
import ReplyModal from '../../../components/Modals/ReplyModal'
import InputDate from '../../../components/Form/InputDate'
import ReactToPrint from 'react-to-print';

const EventList = () => {
  const currentDate = new Date()

  const componentRef = useRef()

  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [modalReply, setModalReply] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedImageId, setSelectedImageId] = useState(null)
  const [isModalPhotoActive, setIsModalPhotoActive] = useState(false)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [title, setTitle] = useState('Últimas ocorrências')
  const [errorSetDateMessage, setErrorSetDateMessage] = useState('')
  const [isFiltering, setIsFiltering] = useState(false)
  const [dateInit, setDateInit] = useState({ day: currentDate.getDate(), month: currentDate.getMonth() + 1, year: currentDate.getFullYear() })
  const [dateEnd, setDateEnd] = useState({ day: currentDate.getDate(), month: currentDate.getMonth() + 1, year: currentDate.getFullYear() })
  const [occurrenceTypes, setOccurrenceTypes] = useState([])
  const [selectedOccorrenceType, setSelectedOccorrenceType] = useState(0)

  const breadcrumb = [
    {
      name: 'Painel Principal',
      link: '/'
    },
    {
      name: 'Listar Eventos',
      link: '/events/list'
    }
  ]

  useEffect(() => {
    fetchEvents()
  }, [page])

  const fetchEvents = async _ => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    api.get(`occurrence/paginate/${page}`)
      .then(resp => {
        setEvents(resp.data.rows)
        setLastPage(resp.data.pages)
        setOccurrenceTypes(resp.data.occurrence_types)
      })
      .catch(err => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (EL1)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const selectDatesHandler = _ => {
    if (!Utils.isValidDate(dateInit.day, dateInit.month, dateInit.year)) {
      return setErrorSetDateMessage('Data inicial não é válida.')
    }
    if (!Utils.isValidDate(dateEnd.day, dateEnd.month, dateEnd.year)) {
      return setErrorSetDateMessage('Data final não é válida.')
    }
    const dateInicial = new Date(dateInit.year, dateInit.month - 1, dateInit.day, 0, 0, 0)
    const dateFinal = new Date(dateEnd.year, dateEnd.month - 1, dateEnd.day, 23, 59, 59)
    if (dateFinal < dateInicial) {
      return setErrorSetDateMessage('Data final precisa ser posterior à data inicial')
    }
    setErrorSetDateMessage('')
    setLoading(true)
    api.post('occurrence/filter', {
      selectedDateInit: dateInicial,
      selectedDateEnd: dateFinal,
      occurrence_type: selectedOccorrenceType
    })
      .then(resp => {
        setEvents(resp.data)
        setLastPage(0)
        setTitle('Acessos entre ' + Utils.printDate(dateInicial) + ' e ' + Utils.printDate(dateFinal))
      })
      .catch(err => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (EL2)')
      })
      .finally(() => {
        setLoading(false)
        setIsFiltering(false)
      })
  }

  const delEvent = async on => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    setMessage(`Confirma exclusão desta ocorrência?`)
    setSelectedEvent(on)
    setModal(true)
  }

  const deleteEventConfirmed = _ => {
    setModal(false)
    setLoading(true)
    api.delete(`occurrence/${selectedEvent.id}`)
      .then(res => {
        toast.info(res.data.message, Constants.TOAST_CONFIG)
        fetchEvents()
      })
      .catch((err) => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (EL2)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const replyHandler = async item => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    setSelectedEvent(item)
    setModalReply(true)
    setSubject('Re: ' + item.title)
    setReplyMessage('')
  }

  const sendHandler = async _ => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    api.post(`message`, {
      messageBody: replyMessage,
      subject,
      receiver: selectedEvent.userRegistering.id
    })
      .then(resp => {
        setModalReply(false)
        toast.info(resp.data.message, Constants.TOAST_CONFIG)
      })
      .catch(err => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CL3)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // const onClickPhotoHandler = item => {
  //   if (!item.photo_id)
  //     return
  //   setSelectedEvent(item)
  //   setIsModalPhotoActive(true)
  // }

  const imgClickHandler = async imgPhotoId => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    setSelectedImageId(imgPhotoId)
    setIsModalPhotoActive(true)
  }

  const changePageHandler = (page) => {
    if (!isNaN(page)) {
      setPage(page)
    }
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
        <div className={classes.TitleDiv}>
          <h2 className='h3'>{title}</h2>
          <button type="button" className={`btn btn-primary ${classes.ButtonIcon}`} onClick={() => setIsFiltering(prev => !prev)}>
            Filtrar <Icon icon='filter' size='2x' color='white' />
          </button>
        </div>
        {
          events.length !== 0 &&
          <div>
            <ReactToPrint
              trigger={() => <button type="button" className={`btn btn-success ${classes.ButtonIcon}`}>
                Imprimir <Icon icon='print' size='2x' color='white' />
              </button>}
              content={() => componentRef.current}
            />
          </div>
        }
        {
          isFiltering && (
            <form className='border border-primary my-4 p-2'>
              <h4 className='text-center'>Filtro</h4>
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
              <div className="form-group mt-2">
                <label>Tipo de ocorrência</label>
                <select className="form-control" value={selectedOccorrenceType} onChange={(ev) => setSelectedOccorrenceType(ev.target.value)}>
                  <option value={0}>Todos</option>
                  {
                    occurrenceTypes.map(el => (
                      <option key={el.id} value={el.id}>{el.type}</option>
                    ))
                  }
                </select>
              </div>
              {errorSetDateMessage &&
                <div className="alert alert-danger text-center" role="alert">
                  {errorSetDateMessage}
                </div>
              }
              <ActionButtons
                textButton1='Filtrar'
                textButton2='Cancelar'
                action1={() => selectDatesHandler()}
                action2={() => setIsFiltering(false)}
              />
            </form>
          )
        }
        {
          lastPage > 1 &&
          <Pagination page={page} lastPage={lastPage} change={changePageHandler} />
        }
        {
          events.length > 0 && (
            <div ref={componentRef} className='landscape'>
              <div className='to-print text-center my-4'>
                <img src={logo} alt='logo' width={300} />
                <h2 className='h2 mt-2'>{title}</h2>
              </div>
              {
                events.map(el => (
                  <div className='col-12 mb-4 p-2 break-inside' key={el.id}>
                    <Card outline color="info">
                      <CardHeader>
                        <div className='no-print'>
                          <IconButtons
                            action2={() => { delEvent(el) }}
                            action3={Utils.canShowMessage(user) ? () => { replyHandler(el) } : null}
                            icon3='reply'
                            color3='#2336F9'
                          />
                        </div>
                      </CardHeader>
                      <CardBody>
                        <div style={{ border: '1px solid #ddd', paddingBottom: '10px' }}>
                          <div>
                            {
                              !!el.OccurrenceImages.length &&
                              <div className={classes.Images}>
                                {
                                  el.OccurrenceImages.map(img => (
                                    <div key={img.photo_id} onClick={() => imgClickHandler(img.photo_id)}>
                                      <img src={Constants.PREFIX_IMG_GOOGLE_CLOUD + img.photo_id} className={classes.Img} alt='event' />
                                    </div>
                                  ))
                                }
                              </div>
                            }
                          </div>
                          <div className='p-2'>
                            {!!el.OccurrenceType?.type && <p className='pt-2 m-0'><span className='enfase'>Assunto:</span> {el.OccurrenceType.type}</p>}
                            {!!el.created_at && <p className='pt-2 m-0'><span className='enfase'>Data:</span> {new Date(el.created_at).toLocaleString()}</p>}
                            {!!el.place && <p className='pt-2 m-0'><span className='enfase'>Local:</span> {el.place}</p>}
                            {!!el.userRegistering.name && <p className='pt-2 m-0'><span className='enfase'>Quem registrou:</span> {el.userRegistering.name} ({Constants.USER_KIND_NAME[el.userRegistering.user_kind_id]})</p>}
                            {!!el.description && <p className='pt-2 m-0'><span className='enfase'>Descrição:</span> {el.description}</p>}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                ))
              }
            </div>
          )
        }
        {
          events.length === 0 &&
          <h4 className='h4'>Não há eventos cadastrados.</h4>
        }
        {
          lastPage > 1 &&
          <Pagination page={page} lastPage={lastPage} change={changePageHandler} />
        }
      </div>
      <ConfirmModal
        message={message}
        modal={modal}
        toggle={() => setModal(false)}
        title='Apagar Evento'
        action1={() => { deleteEventConfirmed() }}
      />
      <ReplyModal
        modal={modalReply}
        toggle={() => setModalReply(false)}
        subject={subject}
        setSubject={setSubject}
        reply={replyMessage}
        setReply={setReplyMessage}
        replyHandler={() => sendHandler()}
      />
      {isModalPhotoActive &&
        <ImageModal
          modal={isModalPhotoActive}
          toggle={() => setIsModalPhotoActive(false)}
          id={selectedImageId}
        />
      }
    </Body>
  );
};

export default EventList;