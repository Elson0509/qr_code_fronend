import React, { useState, useEffect } from 'react';
import Body from '../../../layout/Body';
import { useAuth } from '../../../contexts/auth'
import * as Constants from '../../../services/constants'
import * as Utils from '../../../services/util'
import api from '../../../services/api'
import IconButtons from '../../../components/Buttons/IconButtons'
import Plate from '../../../components/Plate'
import ImageModal from '../../../components/Modals/ImageModal'
import ConfirmPassModal from '../../../components/Modals/ConfirmPassModal'
import ConfirmModal from '../../../components/Modals/ConfirmModal'
import ImageCloud from '../../../components/ImageCloud'
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import {
  Card, CardText, CardBody, CardTitle, CardSubtitle, CardHeader,
} from 'reactstrap';

const ResidentSearch = (props) => {
  const { user } = useAuth()
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState('')
  const [unitSelected, setUnitSelected] = useState(null)
  const [passModal, setPassModal] = useState(false)
  const [searchInput, setSearchinput] = useState('')
  const [imageModal, setImageModal] = useState(false)
  const [selectedIdImage, setSelectedIdImage] = useState(0)
  const [modalConfirmDeleteUser, setModalConfirmDeleteUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const breadcrumb = [
    {
      name: 'Painel Principal',
      link: '/'
    },
    {
      name: 'Listar Moradores',
      link: '/residents/search'
    }
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async _ => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    setLoading(true)
    api.get(`user/condo/${user.condo_id}/${Constants.USER_KIND["RESIDENT"]}`)
      .then(resp => {
        setUnits(resp.data)
      })
      .catch(err => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RL1)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const generateInfoUnits = _ => {
    let unitsInfo = []
    units.forEach(bloco => {
      bloco.Units.forEach(unit => {
        const unitInfo = {}
        unitInfo.bloco_id = bloco.id
        unitInfo.bloco_name = bloco.name
        unitInfo.residents = unit.Users
        unitInfo.vehicles = unit.Vehicles
        unitInfo.number = unit.number
        unitInfo.id = unit.id
        unitsInfo.push(unitInfo)
      })
    })

    if (searchInput) {
      unitsInfo = unitsInfo.filter(el => {
        return el.residents.some(res => Utils.removeAccent(res.name.toLowerCase()).indexOf(Utils.removeAccent(searchInput.toLowerCase())) !== -1) ||
          el.vehicles.some(vei => Utils.removeAccent(vei.plate.toLowerCase()).indexOf(Utils.removeAccent(searchInput.toLowerCase())) !== -1) ||
          // el.bloco_name.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 ||
          Utils.removeAccent(el.number.toLowerCase()).indexOf(Utils.removeAccent(searchInput.toLowerCase())) !== -1
      })
    }
    return unitsInfo
  }

  const delUnitModal = async unit => {
    const isConnected = await Utils.checkInternetConnection(setLoading)
    if (!isConnected) {
      return
    }
    if (!unit.residents.length && !unit.vehicles.length) {
      return toast.info('Unidade sem moradores para apagar.', Constants.TOAST_CONFIG)
    }
    setUnitSelected(unit)
    setMessage(`Excluir moradores e veículos do Bloco ${unit.bloco_name} unidade ${unit.number}?`)
    setModal(true)
  }

  const modalConfirmPassHandler = () => {
    setModal(false)
    setPassModal(true)
  }

  const clickImageHandler = resident => {
    if (resident.photo_id) {
      setSelectedIdImage(resident.photo_id)
      setImageModal(true)
    }
  }

  const deleteUnitConfirmed = _ => {
    setPassModal(false)
    setLoading(true)
    api.delete(`user/unit/${unitSelected.id}`, {
      data: {
        user_id_last_modify: user.id,
      }
    })
      .then(res => {
        toast.info(res.data.message, Constants.TOAST_CONFIG)
        fetchUsers()
      })
      .catch((err) => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RL2)', Constants.TOAST_CONFIG)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const editUserHandler = resident => {
    props.history.push('/resident/edit',
      {
        resident
      }
    )
  }

  const delUserModal = resident => {
    setSelectedUser(resident)
    setModalConfirmDeleteUser(true)
  }

  const confirmDeleteUserHandler = _ => {
    api.delete(`user/${selectedUser.id}`)
      .then(res => {
        toast.info(res.data?.message || 'Usuário apagado.', Constants.TOAST_CONFIG)
        setModalConfirmDeleteUser(false)
        fetchUsers()
      })
      .catch((err) => {
        Utils.toastError(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (DU3)')
      })
  }

  const editHandler = unit => {
    props.history.push('/residents/edit',
      {
        selectedBloco: {
          id: unit.bloco_id,
          name: unit.bloco_name
        },
        selectedUnit: {
          id: unit.id,
          number: unit.number
        },
        residents: unit.residents,
        vehicles: unit.vehicles,
      }
    )
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
        <div className='col-12'>
          <form>
            <div className="form-group">
              <label>Pesquisar</label>
              <input type="email" className="form-control" placeholder="Nome, placa ou unidade" value={searchInput} onChange={(ev) => setSearchinput(ev.target.value)} />
            </div>
          </form>
          {
            generateInfoUnits().length === 0 && (
              <div className="alert alert-danger my-4" role="alert">
                Não há unidades que satisfazem a pesquisa
              </div>
            )
          }
        </div>
        {
          units.length > 0 && (
            generateInfoUnits().map(el => (
              <div className='col-lg-6 col-md-12 mb-4 p-2' key={el.id}>
                <Card body outline color="info">
                  <CardHeader>
                    <CardTitle tag="h4" className='text-center'>Bloco {el.bloco_name}</CardTitle>
                    <CardSubtitle tag="h5" className="mb-2 text-muted text-center">Unidade {el.number}</CardSubtitle>
                    {
                      user.user_kind === Constants.USER_KIND['SUPERINTENDENT'] &&
                      <IconButtons
                        action1={() => editHandler(el)}
                        action2={() => delUnitModal(el)}
                      />
                    }
                  </CardHeader>
                  <CardBody>
                    <CardText tag='h6'>Moradores:</CardText>
                    {
                      el.residents.length === 0 && (
                        <h6 className='h6 text-danger'>Sem moradores cadastrados</h6>
                      )
                    }
                    {
                      !!el.residents.length && el.residents.map((resident) => (
                        <div style={{ border: '1px solid #ddd', paddingBottom: '10px' }} key={resident.id}>
                          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '15px', cursor: 'pointer' }} onClick={() => clickImageHandler(resident)}>
                            <ImageCloud id={resident.photo_id} height={180} />
                          </div>
                          <div style={{background: '#eaeaea'}}>
                            {
                              user.user_kind === Constants.USER_KIND['SUPERINTENDENT'] &&
                              <IconButtons
                                icon1='user-edit'
                                icon2='user-times'
                                action1={() => editUserHandler(resident)}
                                action2={() => delUserModal(resident)}
                              />
                            }
                          </div>
                          <p className='text-center p-0 m-0'>{resident.name}</p>
                          {/* <p className='text-center p-0 m-0'>{resident.email}</p> */}
                        </div>
                      ))
                    }
                  </CardBody>
                  <CardBody>
                    <CardText tag='h6' style={{ borderTop: '3px solid #ddd', paddingTop: '10px' }}>Veículos Cadastrados:</CardText>
                    {
                      el.vehicles.length === 0 && (
                        <h6 className='h6 text-danger'>Sem veículos cadastrados</h6>
                      )
                    }
                    {
                      !!el.vehicles.length && el.vehicles.map((vehicle, ind) => (
                        <div style={{ borderBottom: ind === el.vehicles.length - 1 ? 'none' : '1px solid #ddd', paddingBottom: '10px' }} key={vehicle.id}>
                          <p className='text-center'>{vehicle.maker} {vehicle.modle} {vehicle.color}</p>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Plate plate={vehicle.plate} />
                          </div>
                        </div>
                      ))
                    }
                  </CardBody>
                </Card>
              </div>
            ))
          )
        }
      </div>
      <ConfirmModal
        message={message}
        modal={modal}
        toggle={() => setModal(false)}
        title='Apagar moradores'
        action1={() => modalConfirmPassHandler()}
      />
      <ConfirmModal
        message='Confirma a exclusão deste morador?'
        modal={modalConfirmDeleteUser}
        toggle={() => setModalConfirmDeleteUser(false)}
        title='Apagar morador'
        action1={() => confirmDeleteUserHandler()}
      />
      <ConfirmPassModal
        modal={passModal}
        toggle={() => setPassModal(false)}
        action={() => deleteUnitConfirmed()}
      />
      <ImageModal
        modal={imageModal}
        toggle={() => setImageModal(false)}
        id={selectedIdImage}
      />
    </Body>
  );
};

export default ResidentSearch;