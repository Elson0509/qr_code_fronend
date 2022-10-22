import React, { useState, useEffect } from 'react'
import Body from '../../../layout/Body'
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import { useAuth } from '../../../contexts/auth'
import api from '../../../services/api'
import ConfirmModal from '../../../components/Modals/ConfirmModal'
import FormComment from '../../../components/Form/FormComment'
import { Alert, Spinner } from 'reactstrap'
import { toast } from 'react-toastify'
import ButtonIcon from '../../../components/Buttons/ButtonIcon'
import GeneralCard from '../../../components/GeneralCard'
import FormInput from '../../../components/Form/FormInput'

const News = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState([])
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const [selectedNews, setSelectedNews] = useState(null)
  const [modalAddNews, setModalAddNews] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const breadcrumb = [
    {
      name: 'Painel Principal',
      link: '/'
    },
    {
      name: 'Avisos',
      link: '/news'
    }
  ]

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    api.get(`news`)
      .then(resp => {
        setNews(resp.data)
      })
      .catch(err => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA1)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const deleteNewsHandler = mail => {
    setSelectedNews(mail)
    setModalMessage(true)
  }

  const sendMessageHandler = () => {
    if (!title) {
      return setErrorMessage('Título não pode estar em branco')
    }
    if (!message) {
      return setErrorMessage('Mensagem não pode estar em branco')
    }
    if (title.trim().length < Constants.NEWS_TITLE_MIN_SIZE) {
      return setErrorMessage(`Título precisa de pelo menos ${Constants.NEWS_TITLE_MIN_SIZE} caracteres`)
    }
    if (message.trim().length < Constants.NEWS_MESSAGE_MIN_SIZE) {
      return setErrorMessage(`Título precisa de pelo menos ${Constants.NEWS_MESSAGE_MIN_SIZE} caracteres`)
    }
    setLoading(true)
    api.post(`news`,
      {
        title,
        message
      })
      .then(() => {
        setModalAddNews(false)
        toast.info('Aviso enviado com sucesso.', Constants.TOAST_CONFIG)
        setTitle('')
        setMessage('')
        fetchNews()
      })
      .catch(err => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (SM1)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const confirmDelHandler = () => {
    setModalMessage(false)
    setLoading(true)
    api.delete(`news/${selectedNews.id}`)
      .then(() => {
        toast.info('Aviso apagado!')
        fetchNews()
        setTitle('')
        setMessage('')
      })
      .catch((err) => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (MaD1)', Constants.TOAST_CONFIG)
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
        {
          user.user_kind === Constants.USER_KIND['SUPERINTENDENT'] &&
          <ButtonIcon
            icon='chalkboard-teacher'
            text='Enviar aviso'
            newClass='btn-primary'
            clicked={() => setModalAddNews(true)}
          />
        }
        {
          !!news.length &&
          news.map(el => (
            <GeneralCard
              key={el.id}
              title={el.title}
              comentary={el.message}
              bgColor='bg-light'
            >
              <p className="card-text">
                <small className="text-muted">
                  {Utils.printDateAndHour(new Date(el.createdAt))}
                </small>
              </p>
              {
                user.user_kind === Constants.USER_KIND['SUPERINTENDENT'] &&
                <ButtonIcon
                  text='Excluir'
                  newClass='btn-danger'
                  clicked={() => deleteNewsHandler(el)}
                />
              }
            </GeneralCard>
          ))
        }
      </div>
      <ConfirmModal
        modal={modalAddNews}
        toggle={() => setModalAddNews(false)}
        title='Enviar aviso'
        action1={sendMessageHandler}
      >
        <form>
          <FormInput
            label='Título:'
            value={title}
            changeValue={(val) => setTitle(val)}
          />
          <FormComment
            label='Aviso:'
            value={message}
            changeValue={(val) => setMessage(val)}
          />
          {
            !!errorMessage &&
            <Alert color='danger' className='mt-2'>
              {errorMessage}
            </Alert>
          }
        </form>
      </ConfirmModal>
      <ConfirmModal
        message='Deseja apagar este aviso do condomínio?'
        modal={modalMessage}
        toggle={() => setModalMessage(false)}
        title='Confirme'
        action1={() => { confirmDelHandler() }}
      />
    </Body>
  )
}

export default News