import React, { useState, useEffect } from 'react';
import Body from '../../../layout/Body';
import { useAuth } from '../../../contexts/auth'
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import Icon from '../../../components/Icon';
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import classes from './UnitAdd.module.css'
import GenericModal from '../../../components/Modals/GenericModal'
import { aptNumberAnalyse } from '../../../services/util'

const UnitAdd = _ => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [modalSelectBloco, setModalSelectBloco] = useState(false)
  const [blocosApi, setBlocosApi] = useState(null)
  const [selectedBloco, setSelectedBloco] = useState(false)
  const [readOnlyBlocoInput, setReadOnlyBlocoInput] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [bloco, setBloco] = useState('')
  const [unit, setUnit] = useState('')
  const [modalAssistent, setModalAssistent] = useState(false)
  const [firstApt, setFirstAp] = useState('')
  const [lastApt, setLastAp] = useState('')
  const [errorAptMessage, setErrorAptMessage] = useState('')
  const [modalSuccessAptAnalyse, setModalSuccessAptAnalyse] = useState(false)
  const [aptsAnalysed, setAptsAnalysed] = useState([])
  const [modalNewBlockAnalysed, setModalNewBlockAnalysed] = useState(false)
  const [newBlockAnalysed, setNewBlockAnalysed] = useState('')
  const [errornewBlockAnalysedMessage, setErrornewBlockAnalysedMessage] = useState('')
  const [loadingAddingSmartBloco, setLoadingAddingSmartBloco] = useState(false)

  const breadcrumb = [
    {
      name: 'Painel Principal',
      link: '/'
    },
    {
      name: 'Adicionar Unidade',
      link: '/units/add'
    }
  ]

  useEffect(() => {
    api.get(`/bloco/condo`)
      .then(res => {
        const newBloco = [{ id: "0", name: 'Novo Bloco' }]
        setBlocosApi(newBloco.concat(res.data))
        setModalSelectBloco(true)
      })
      .catch((err) => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (UA1)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
  
  const selectBlocoHandler = bloco => {
    setModalSelectBloco(false)
    if (bloco.id !== '0') {
      setBloco(bloco.name)
      setSelectedBloco(bloco)
      setReadOnlyBlocoInput(true)
    }
    else {
      //new Block
      setSelectedBloco({ id: '0' })
      setModalAssistent(true)
    }
  }
  
  const confirmAptHandler = _ => {
    if (!firstApt || !lastApt) {
      return setErrorAptMessage('Por favor, complete os campos.')
    }
    const apts = aptNumberAnalyse(firstApt, lastApt)
    setAptsAnalysed(apts)
    setModalAssistent(false)
    if (apts) {
      //success
      setModalSuccessAptAnalyse(true)
    }
    else {
      //fail
      toast.error('Desculpe. Não foi possível sugerir unidades com a informação fornecida.', Constants.TOAST_CONFIG)
    }
  }
  
  const confirmAptAnalysed = _ => {
    setModalSuccessAptAnalyse(false)
    setModalNewBlockAnalysed(true)
  }
  
  const confirmAddHandler = async ev => {
    ev.preventDefault()
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    if (!bloco) {
      return setErrorMessage('Bloco não pode estar vazio.')
    }
    if (!unit) {
      return setErrorMessage('Apartamento não pode estar vazio.')
    }
    setLoading(true)
    api.post('/unit', {
      number: unit,
      bloco_id: selectedBloco.id,
      bloco_name: bloco,
      unit_kind_id: 1,
      condo_id: user.condo_id,
    })
    .then((res) => {
      setUnit('')
      toast.info(res.data.message, Constants.TOAST_CONFIG)
    })
    .catch((err) => {
      Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (UA2)', Constants.TOAST_CONFIG)
    })
    .finally(() => {
        setLoading(false)
      })
      
    }
    
    const confirmNewBlockAndUnits = _ => {
      if (!newBlockAnalysed) {
      return setErrornewBlockAnalysedMessage('Por favor, digite o nome do bloco')
    }
    setLoadingAddingSmartBloco(true)
    api.post('unit/bloco/smart',{
      bloco_name: newBlockAnalysed,
      units: aptsAnalysed
    })
    .then(res=>{
      toast.info(res.data.message, Constants.TOAST_CONFIG)
      setModalNewBlockAnalysed(false)
    })
    .catch(err=>{
      setErrornewBlockAnalysedMessage(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (UAS2)')
    })
    .finally(()=>{
      setLoadingAddingSmartBloco(false)
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
        <div className='col-12 pb-4'>
          <form>
            <div className="form-group">
              <label>Bloco:</label>
              <input
                type="text"
                className="form-control"
                aria-describedby="bloco"
                readOnly={readOnlyBlocoInput}
                value={bloco}
                onChange={(ev) => setBloco(ev.target.value)}
                />
            </div>
            <div className="form-group">
              <label>Unidade:</label>
              <input
                type="text"
                className="form-control"
                aria-describedby="unidade"
                value={unit}
                onChange={(ev) => setUnit(ev.target.value)}
              />
            </div>
            {errorMessage && <div className="alert alert-danger my-4 text-center" role="alert">
              {errorMessage}
            </div>}
            <button className="btn btn-primary mt-4" onClick={(ev) => confirmAddHandler(ev)}>Confirmar</button>
          </form>
        </div>

      </div>
      <Modal isOpen={modalSelectBloco} toggle={() => setModalSelectBloco(prev => !prev)}>
        <ModalHeader toggle={() => setModalSelectBloco(prev => !prev)}>Selecione o bloco</ModalHeader>
        <ModalBody>
          <div className={classes.ButtonsDiv}>
            {
              !!blocosApi && (
                blocosApi.map(el => {
                  if (el.id === '0')
                    return (
                      <button className={classes.ButtonBloco} onClick={() => selectBlocoHandler(el)}>
                        <Icon icon='plus-square' color='white' />
                        <span style={{ marginLeft: '8px' }}>{el.name}</span>
                      </button>
                    )
                  return (
                    <button className={classes.ButtonBloco} onClick={() => selectBlocoHandler(el)}>
                      {el.name}
                    </button>
                  )
                })
              )
            }
          </div>
        </ModalBody>
      </Modal>
      <GenericModal
        title='Assistente'
        toggle={() => setModalAssistent(false)}
        modal={modalAssistent}
      >
        <p>Este é o assistente de unidades. Digite o primeiro e o último apartamento do bloco para que sejam adicionados automaticamente.</p>
        <div className="form-group py-2">
          <label>Primeiro Apartamento:</label>
          <input
            type="text"
            className="form-control"
            aria-describedby="first aptl"
            value={firstApt}
            placeholder='Ex: 101, 101A'
            onChange={ev => setFirstAp(ev.target.value)}
          />
        </div>
        <div className="form-group py-2">
          <label>Último Apartamento:</label>
          <input
            type="text"
            className="form-control"
            aria-describedby="last apt"
            value={lastApt}
            placeholder='Ex: 820, 820B'
            onChange={ev => setLastAp(ev.target.value)}
          />
        </div>
        {errorAptMessage && <div className="alert alert-danger my-4 text-center" role="alert">
          {errorAptMessage}
        </div>}
        <button className="btn btn-primary col-12" onClick={(ev) => confirmAptHandler(ev)}>Confirmar</button>
      </GenericModal>
      <GenericModal
        title='Unidades encontradas'
        toggle={() => setModalSuccessAptAnalyse(false)}
        modal={modalSuccessAptAnalyse}
      >
        <p>Sugerimos as seguintes unidades. Confirma?</p>
        <div className='mb-2'>
          <div className={classes.SuccessAnalyse}>
            {
              aptsAnalysed ? aptsAnalysed.join(', ') : null
            }
          </div>
          <small className='font-weight-light'>Obs: Mesmo confirmando, você ainda poderá fazer alterações.</small>
        </div>
        <button className="btn btn-primary col-12 my-2" onClick={(ev) => confirmAptAnalysed(ev)}>Confirmar</button>
        <button className="btn btn-danger col-12" onClick={() => setModalSuccessAptAnalyse(false)}>Cancelar</button>
      </GenericModal>
      <GenericModal
        title='Novo Bloco'
        toggle={() => setModalNewBlockAnalysed(false)}
        modal={modalNewBlockAnalysed}
      >
        <div className="form-group py-2">
          <label>Nome do novo bloco:</label>
          <input
            type="text"
            className="form-control"
            aria-describedby="last apt"
            value={newBlockAnalysed}
            onChange={ev => setNewBlockAnalysed(ev.target.value)}
          />
        </div>
        {errornewBlockAnalysedMessage && <div className="alert alert-danger my-4 text-center" role="alert">
          {errornewBlockAnalysedMessage}
        </div>}
        {
          loadingAddingSmartBloco ?
            <Spinner />
            :
            <div>
              <button className="btn btn-primary col-12 my-2" onClick={(ev) => confirmNewBlockAndUnits(ev)}>Confirmar</button>
              <button className="btn btn-danger col-12" onClick={() => setModalNewBlockAnalysed(false)}>Cancelar</button>
            </div>
        }
      </GenericModal>
    </Body>
  );
};

export default UnitAdd;