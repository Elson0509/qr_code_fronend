import React, { useState, useEffect } from 'react'
import Body from '../../layout/Body'
import * as Utils from '../../services/util'
import api from '../../services/api'
import { Spinner } from 'reactstrap'
import Pagination from '../../components/Pagination'
import { toast } from 'react-toastify'
import AccessTable from '../../components/Tables/AccessTable'
import Icon from '../../components/Icon'
import classes from './index.module.css'
import InputDate from '../../components/Form/InputDate'
import ActionButtons from '../../components/Buttons/ActionButtons'
import AccessReport from '../../components/Reports/AccessReport'
import { PDFDownloadLink } from '@react-pdf/renderer';

const Access = () => {
  const currentDate = new Date()

  const [accesses, setAccesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [isFiltering, setIsFiltering] = useState(false)
  const [dateInit, setDateInit] = useState({ day: currentDate.getDate(), month: currentDate.getMonth() + 1, year: currentDate.getFullYear() })
  const [dateEnd, setDateEnd] = useState({ day: currentDate.getDate(), month: currentDate.getMonth() + 1, year: currentDate.getFullYear() })
  const [errorSetDateMessage, setErrorSetDateMessage] = useState('')
  const [title, setTitle] = useState('Últimos acessos')
  const [inicialDate, setInicialDate] = useState('')
  const [finalDate, setFinalDate] = useState('')

  const breadcrumb = [
    {
      name: 'Painel Principal',
      link: '/'
    },
    {
      name: 'Acessos',
      link: '/access'
    }
  ]

  useEffect(() => {
    const fetchEvents = async _ => {
      const isConnected = await Utils.checkInternetConnection(setLoading)
      if (!isConnected) {
        return
      }
      setLoading(true)

      api.get(`access/paginate/${page}`)
        .then(resp => {
          setAccesses(resp.data.rows)
          setLastPage(resp.data.pages)
        })
        .catch(err => {
          Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (A1)')
        })
        .finally(() => {
          setLoading(false)
        })
    }
    fetchEvents()
  }, [page])

  const selectDatesHandler = _ => {
    if (!Utils.isValidDate(dateInit.day, dateInit.month, dateInit.year)) {
      return setErrorSetDateMessage('Data inicial não é válida.')
    }
    if (!Utils.isValidDate(dateEnd.day, dateEnd.month, dateEnd.year)) {
      return setErrorSetDateMessage('Data final não é válida.')
    }
    const dateInicial = new Date(dateInit.year, dateInit.month - 1, dateInit.day, 0, 0, 0)
    const dateFinal = new Date(dateEnd.year, dateEnd.month - 1, dateEnd.day, 23, 59, 59)
    setInicialDate(dateInicial)
    setFinalDate(dateFinal)
    if (dateFinal < dateInicial) {
      return setErrorSetDateMessage('Data final precisa ser posterior à data inicial')
    }
    setErrorSetDateMessage('')
    setLoading(true)
    api.post('access/filter', { selectedDateInit: dateInicial, selectedDateEnd: dateFinal })
      .then(resp => {
        setAccesses(resp.data)
        setLastPage(0)
        setTitle('Acessos entre ' + Utils.printDate(dateInicial) + ' e ' + Utils.printDate(dateFinal))
      })
      .catch(err => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (A2)')
      })
      .finally(() => {
        setLoading(false)
        setIsFiltering(false)
      })
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
          accesses.length !== 1 &&
          <PDFDownloadLink document={<AccessReport accesses={accesses} inicialDate={inicialDate} finalDate={finalDate}/>} fileName="relatório.pdf">
            {({ blob, url, loading, error }) =>
              loading ?
                <button type="button" className={`btn btn-danger ${classes.ButtonIcon}`} disabled>
                  Gerando...
                </button> :
                <button type="button" className={`btn btn-success ${classes.ButtonIcon}`}>
                  Download <Icon icon='table-list' size='2x' color='white' />
                </button>
            }
          </PDFDownloadLink>
        }
        {
          lastPage > 1 &&
          <Pagination page={page} lastPage={lastPage} change={changePageHandler} />
        }
        {
          accesses.length === 0 &&
          <h2 className='text-center'>Não há acessos registrados.</h2>
        }
        {
          accesses.length > 0 &&
          <AccessTable page={page} accesses={accesses} />
        }
        {
          lastPage > 1 &&
          <Pagination page={page} lastPage={lastPage} change={changePageHandler} />
        }
      </div>
    </Body>
  );
};

export default Access;