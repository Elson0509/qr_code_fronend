import React, { useState, Fragment } from 'react'
import { useAuth } from '../../contexts/auth'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import Icon from '../Icon';
import { Collapse } from 'reactstrap'
import { Link } from 'react-router-dom'
import classes from './accordionMenu.module.css'

const AccordionMenu = () => {
  const { user } = useAuth()
  const [modalUnits, setModalUnits] = useState(false)
  const [modalResidents, setModalResidents] = useState(false)
  const [modalVisitors, setModalVisitors] = useState(false)
  const [modalThirds, setModalThirds] = useState(false)
  const [modalGuard, setModalGuard] = useState(false)
  const [modalCar, setModalCar] = useState(false)
  const [modalEvent, setModalEvent] = useState(false)
  const [modalCondo, setModalCondo] = useState(false)
  const [modalSindico, setModalSindico] = useState(false)

  const submenuOptions = [
    { menuName: "Adicionar", icon: 'plus-square', key: 'plus', url: 'add' },
    { menuName: "Listar", icon: 'list-alt', key: 'list', url: 'list' },
  ]

  const menuOptionsCars = [
    { menuName: "Pesquisar", icon: 'search', key: 'search', url: 'Search' },
    { menuName: "Listar", icon: 'list-alt', key: 'list', url: 'List' }
  ]

  const subMenuOptionsResidents = []

  if (user.user_kind === Constants.USER_KIND['SUPERINTENDENT']) {
    subMenuOptionsResidents.push({ menuName: "Adicionar", icon: 'plus-square', key: 'plus', url: 'Add' })
  }
  subMenuOptionsResidents.push({ menuName: "Listar", icon: 'list-alt', key: 'list', url: 'List' })

  const menu = {
    menuOptionsQRCode: { menuName: "Meu QR Code", icon: 'qrcode', key: 'QRCode', url: 'MyQRCode', code: 'MyQRCode' },
    menuOptionsScan: { menuName: "Escanear", icon: 'camera', key: 'Scan', url: 'Scan', code: 'Scan' },
    menuOptionsUnits: { menuName: "Unidades", icon: 'building', key: 'building', url: 'Units', code: 'Units', submenuOptions, toggle: setModalUnits, modal: modalUnits },
    menuOptionsResidents: { menuName: "Moradores", icon: 'house-user', key: 'resident', url: 'Residents', code: 'Residents', submenuOptions: subMenuOptionsResidents, toggle: setModalResidents, modal: modalResidents },
    menuOptionsResidentsToGuard: { menuName: "Moradores", icon: 'house-user', key: 'residentGuard', url: 'Residents/list', code: 'Residents' },
    menuOptionsVisitorWithAdd: { menuName: "Visitantes", icon: 'user-friends', key: 'visitor', url: 'Visitors', code: 'Visitors', submenuOptions, toggle: setModalVisitors, modal: modalVisitors },
    menuOptionsVisitorNoAdd: { menuName: "Visitantes", icon: 'user-friends', key: 'visitor', url: 'Visitors/list', code: 'Visitors' },
    menuOptionsServiceWithAdd: { menuName: "Terceirizados", icon: 'people-carry', key: 'service', url: 'Thirds', code: 'Thirds', submenuOptions, toggle: setModalThirds, modal: modalThirds },
    menuOptionsServiceNoAdd: { menuName: "Terceirizados", icon: 'people-carry', key: 'service', url: 'Thirds/list', code: 'Thirds' },
    menuOptionsGuard: { menuName: "Colaboradores", icon: 'user-shield', key: 'guard', url: 'Guards', code: 'Guards', submenuOptions, toggle: setModalGuard, modal: modalGuard },
    menuOptionsCarSuperIntendent: { menuName: "Pernoite", icon: 'car', key: 'car', url: 'Car', code: 'Cars', submenuOptions: menuOptionsCars, toggle: setModalCar, modal: modalCar },
    menuOptionsCarGuard: { menuName: "Pernoite", icon: 'car', key: 'car', url: 'Car/Search', code: 'Cars' },
    menuOptionsEventResident: { menuName: "Ocorrências", icon: 'exclamation', key: 'event', url: 'Events/Add', code: 'Events' },
    menuOptionsEventGuard: { menuName: "Ocorrências", icon: 'exclamation', key: 'event', url: 'Events/Add', code: 'Events' },
    menuOptionsEventSuperintendent: { menuName: "Ocorrências", icon: 'exclamation', key: 'event', url: 'Events', code: 'Events', submenuOptions, toggle: setModalEvent, modal: modalEvent },
    menuOptionsSurvey: { menuName: "Avaliação", icon: 'smile', key: 'pesquisa', url: 'Survey', code: 'Survey' },
    menuOptionsInfo: { menuName: "Informações", icon: 'info-circle', key: 'info', url: 'Info', code: 'Info' },
    menuOptionsCondo: { menuName: "Condomínios", icon: 'city', key: 'condo', url: 'Condo', code: 'Residents', submenuOptions, toggle: setModalCondo, modal: modalCondo },
    menuOptionsSindico: { menuName: "Administradores", icon: 'users-cog', key: 'sindico', url: 'Sindico', code: 'Visitors', submenuOptions, toggle: setModalSindico, modal: modalSindico },
    menuOptionsSlot: { menuName: "Estacionamento", icon: 'car-side', key: 'slot', url: 'Slot', code: 'Slot' },
    menuOptionsAccess: { menuName: "Acessos", icon: 'people-arrows-left-right', key: 'access', url: 'access', code: 'Access' },
  }

  const profiles = []
  profiles[Constants.USER_KIND['RESIDENT']] = [menu.menuOptionsQRCode, Utils.canAddOcorrences(user) ? menu.menuOptionsEventResident : null,  Utils.canAddVisitors(user) ? menu.menuOptionsVisitorWithAdd : null, Utils.canAddThirds(user) ? menu.menuOptionsServiceWithAdd : null]
  profiles[Constants.USER_KIND['GUARD']] = [menu.menuOptionsQRCode, menu.menuOptionsScan, menu.menuOptionsResidentsToGuard, Utils.canAddVisitors(user) ? menu.menuOptionsVisitorWithAdd : menu.menuOptionsVisitorNoAdd, Utils.canAddThirds(user) ? menu.menuOptionsServiceWithAdd : menu.menuOptionsServiceNoAdd, menu.menuOptionsCarGuard, menu.menuOptionsEventGuard, menu.menuOptionsSlot]
  profiles[Constants.USER_KIND['SUPERINTENDENT']] = [menu.menuOptionsQRCode, menu.menuOptionsScan, menu.menuOptionsUnits, menu.menuOptionsResidents, menu.menuOptionsVisitorWithAdd, menu.menuOptionsServiceWithAdd, menu.menuOptionsGuard, menu.menuOptionsCarSuperIntendent, menu.menuOptionsEventSuperintendent, menu.menuOptionsSlot, menu.menuOptionsAccess]
  profiles[Constants.USER_KIND['ADM']] = [menu.menuOptionsCondo, menu.menuOptionsSindico]

  return (
    <nav>
      <ul className='list-group'>
        {
          profiles[user.user_kind].map(el => {
            if(!el) return null
            return (
              <div key={el.key}>
                {
                  el.submenuOptions ?
                    <Fragment>
                      <li className={`list-group-item list-group-item-action ${classes.MenuItem}`} onClick={() => el.toggle(prev => !prev)}>
                        <div className={classes.Icon}>
                          <Icon icon={el.icon} size='lg' color='white' />
                        </div>
                        <span className={classes.MenuName}>
                          {el.menuName}
                        </span>
                      </li>
                      <Collapse isOpen={el.modal}>
                        <ul className='list-group'>
                          {
                            el.submenuOptions.map(sm => {
                              return (
                                <Link to={`/${el.url.toLowerCase()}/${sm.url.toLowerCase()}`} key={el.key + sm.key}>
                                  <li className={`list-group-item ${classes.SubMenuItem}`} style={{}}>
                                    <div className={classes.Icon}>
                                      <Icon icon={sm.icon} size='lg' color='white' />
                                    </div>
                                    <span className={classes.MenuName}>
                                      {sm.menuName}
                                    </span>
                                  </li>
                                </Link>
                              )
                            })

                          }
                        </ul>
                      </Collapse>
                    </Fragment>
                    :
                    <Link to={`/${el.url.toLowerCase()}`}>
                      <li className={`list-group-item list-group-item-action ${classes.MenuItem}`} style={{}}>
                        <div className={classes.Icon}>
                          <Icon icon={el.icon} size='lg' color='white' />
                        </div>
                        <span className={classes.MenuName}>
                          {el.menuName}
                        </span></li>
                    </Link>

                }
              </div>
            )
          })
        }
      </ul>
    </nav>
  );
};

export default AccordionMenu;