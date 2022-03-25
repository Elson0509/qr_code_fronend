import React, { useState, useEffect } from 'react';
import Body from '../../../layout/Body';
import { useAuth } from '../../../contexts/auth'
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import Icon from '../../../components/Icon';
import ConfirmModal from '../../../components/Modals/ConfirmModal';
import ConfirmPassModal from '../../../components/Modals/ConfirmPassModal'
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const UnitList = (props) => {
  const { user } = useAuth()
  const [errorMessageModalEdit, setErrorMessageModalEdit] = useState('')
  const [dataFetched, setDataFetched] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [unitWillUpdate, setUnitWillUpdate] = useState(null)
  const [modalConfirm, setModalConfirm] = useState(false)
  const [modalEditUnit, setModalEditUnit] = useState(false)
  const [modalMessage, setmodalMessage] = useState('')
  const [passModal, setPassModal] = useState(false)

  const breadcrumb = [
    {
      name: 'Painel Principal',
      link: '/'
    },
    {
      name: 'Listar Unidades',
      link: '/units/list'
    }
  ]

  useEffect(() => {
    listUnits()
  }, [])

  const listUnits = async _ => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    setLoading(true)
    api.get(`condo/${user.condo_id}`)
      .then(resp => {
        setDataFetched(resp.data)
      })
      .catch(err => {
        console.log(err)
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (UL1)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const unitList = _ => {
    const units = []
    dataFetched.forEach(elbloco => {
      elbloco.Units.forEach(elunit => {
        const unit = {}
        unit.bloco_id = elbloco.id
        unit.bloco_name = elbloco.name
        unit.unit_id = elunit.id
        unit.unit_number = elunit.number
        units.push(unit)
      })
    })
    return units
  }

  const editClickHandler = async unit => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    setSelectedUnit(unit)
    setUnitWillUpdate(unit)
    setModalEditUnit(true)
    setErrorMessageModalEdit('')
  }

  const deleteClickHandler = async unit => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    setSelectedUnit(unit)
    setmodalMessage(`Confirma exclusão da Unidade ${unit.unit_number} do bloco ${unit.bloco_name}, seus moradores e visitantes?`)
    setModalConfirm(true)
  }

  const modalConfirmPassHandler = () => {
    setModalConfirm(false)
    setPassModal(true)
  }

  const confirmDeleteHandler = () => {
    setPassModal(false)
    setLoading(true)
    api.delete(`/unit`, {
      data: {
        user_id_last_modify: user.id,
        bloco_id: selectedUnit.bloco_id,
        number: selectedUnit.unit_number
      }
    })
      .then((resp) => {
        toast.info(resp.data.message, Constants.TOAST_CONFIG)
        listUnits()
      })
      .catch((err) => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (UL2)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const editUnitConfirmed = _ => {
    if (unitWillUpdate.bloco_name === '' || unitWillUpdate.unit_number === '') {
      return setErrorMessageModalEdit('Não pode haver campo vazio.')
    }
    setModalEditUnit(false)
    setLoading(true)
    api.post('/unit/bloco', {
      unitSelected: selectedUnit,
      unitWillUpdate,
      condo_id: user.condo_id,
      user_id_last_modify: user.id
    })
      .then((resp) => {
        toast.info(resp.data.message, Constants.TOAST_CONFIG)
      })
      .catch((err) => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (UL3)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
        listUnits()
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
          {
            !!dataFetched && unitList().map(unit => {
              return (
                <ul className="list-group" key={unit.unit_id}>
                  <li className="list-group-item d-flex justify-content-between list-group-item-action align-items-center ">
                    {`Bloco ${unit.bloco_name} unidade ${unit.unit_number}`}
                    <span>
                      <span style={{ marginRight: '15px', cursor: 'pointer' }}>
                        <span onClick={() => editClickHandler(unit)}><Icon icon='edit' size='lg' color='#B39C00' /></span>
                      </span>
                      <span style={{ cursor: 'pointer' }}>
                        <span onClick={() => deleteClickHandler(unit)}><Icon icon='window-close' size='lg' color='#FF6666' /></span>
                      </span>
                    </span>
                  </li>
                </ul>
              )

            })
          }
          {
            !!dataFetched && dataFetched.length === 0 && (
              <h3 className='h3 text-center'>Não há unidades cadastradas</h3>
            )
          }
        </div>
        <ConfirmModal
          modal={modalConfirm}
          toggle={() => setModalConfirm(prev => !prev)}
          title='Confirma exclusão de unidade?'
          message={modalMessage}
          action1={() => modalConfirmPassHandler()}
        />
        <Modal isOpen={modalEditUnit} toggle={() => setModalEditUnit(prev => !prev)}>
          <ModalHeader toggle={() => setModalEditUnit(prev => !prev)}>Editar unidade</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>Bloco</label>
              <input
                type="text"
                className="form-control"
                aria-describedby="bloco"
                placeholder="Bloco"
                value={unitWillUpdate?.bloco_name}
                onChange={(ev) => setUnitWillUpdate({ ...unitWillUpdate, bloco_name: ev.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Unidade</label>
              <input
                type="text"
                className="form-control"
                placeholder="Unidade"
                value={unitWillUpdate?.unit_number}
                onChange={(ev) => setUnitWillUpdate({ ...unitWillUpdate, unit_number: ev.target.value })}
              />
            </div>
            {errorMessageModalEdit && <div className="alert alert-danger mt-4" role="alert">
              {errorMessageModalEdit}
            </div>}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => { editUnitConfirmed() }}>Confirmar</Button>
            <Button color="secondary" onClick={() => setModalEditUnit(prev => !prev)}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </div>
      <ConfirmPassModal
        modal={passModal}
        toggle={() => setPassModal(false)}
        action={() => confirmDeleteHandler()}
      />
    </Body>
  );
};

export default UnitList;