import React, {Fragment, useState} from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import {useAuth} from '../../contexts/auth';
import Header from '../../layout/Header'
import * as Constants from '../../services/constants'
import Icon from '../../components/Icon';
import classes from './dashboard.module.css'
import Greeting from '../../components/Greeting';
import { Link } from 'react-router-dom'

const Dashboard = () => {

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

    const subMenuOptionsResidents = [ ]

    if(user.user_kind === Constants.USER_KIND['SUPERINTENDENT']){
        subMenuOptionsResidents.push({ menuName: "Adicionar", icon: 'plus-square', key: 'plus', url: 'Add' })
    }
    subMenuOptionsResidents.push({ menuName: "Listar", icon: 'list-alt', key: 'list', url: 'List' })
    
    const menu = {
        menuOptionsQRCode : { menuName: "Meu QR Code", icon: 'qrcode', key: 'QRCode', url: 'MyQRCode', code: 'MyQRCode' },
        menuOptionsScan : { menuName: "Escanear", icon: 'camera', key: 'Scan', url: 'Scan', code: 'Scan' },
        menuOptionsUnits : { menuName: "Unidades", icon: 'building', key: 'building', url: 'Units', code: 'Units', submenuOptions, toggle: setModalUnits, modal: modalUnits },
        menuOptionsResidents : { menuName: "Moradores", icon: 'house-user', key: 'resident', url: 'Residents', code: 'Residents', submenuOptions: subMenuOptionsResidents, toggle: setModalResidents, modal: modalResidents },
        menuOptionsResidentsToGuard : { menuName: "Moradores", icon: 'house-user', key: 'residentGuard', url: 'Residents/list', code: 'Residents' },
        menuOptionsVisitor : { menuName: "Visitantes", icon: 'user-friends', key: 'visitor', url: 'Visitors', code: 'Visitors', submenuOptions, toggle: setModalVisitors, modal: modalVisitors },
        menuOptionsService : { menuName: "Terceirizados", icon: 'people-carry', key: 'service', url: 'Thirds', code: 'Thirds', submenuOptions, toggle: setModalThirds, modal: modalThirds },
        menuOptionsGuard : { menuName: "Colaboradores", icon: 'user-shield', key: 'guard', url: 'Guards', code: 'Guards', submenuOptions, toggle: setModalGuard, modal: modalGuard  },
        menuOptionsCarSuperIntendent : { menuName: "Pernoite", icon: 'car', key: 'car', url: 'Car', code: 'Cars', submenuOptions:menuOptionsCars, toggle: setModalCar, modal: modalCar },
        menuOptionsCarGuard : { menuName: "Pernoite", icon: 'car', key: 'car', url: 'Car/Search', code: 'Cars' },
        menuOptionsEventResident : { menuName: "Ocorrências", icon: 'exclamation', key: 'event', url: 'Events/Add', code: 'Events' },
        menuOptionsEventGuard : { menuName: "Ronda", icon: 'exclamation', key: 'event', url: 'Events/Add', code: 'Events' },
        menuOptionsEventSuperintendent : { menuName: "Ronda", icon: 'exclamation', key: 'event', url: 'Events', code: 'Events', submenuOptions, toggle: setModalEvent, modal: modalEvent },
        menuOptionsSurvey : { menuName: "Avaliação", icon: 'smile', key: 'pesquisa', url: 'Survey', code: 'Survey' },
        menuOptionsInfo : { menuName: "Informações", icon: 'info-circle', key: 'info', url: 'Info', code: 'Info' },
        menuOptionsCondo : { menuName: "Condomínios", icon: 'city', key: 'condo', url: 'Condo', code: 'Residents', submenuOptions, toggle: setModalCondo, modal: modalCondo},
        menuOptionsSindico : { menuName: "Administradores", icon: 'users-cog', key: 'sindico', url: 'Sindico', code: 'Visitors', submenuOptions, toggle: setModalSindico, modal: modalSindico },
        menuOptionsSlot : { menuName: "Estacionamento", icon: 'car-side', key: 'slot', url: 'Slot', code: 'Slot'},
    }

    const profiles = []
    profiles[Constants.USER_KIND['RESIDENT']]=[menu.menuOptionsQRCode, menu.menuOptionsEventResident, menu.menuOptionsSurvey]
    profiles[Constants.USER_KIND['GUARD']]=[menu.menuOptionsQRCode, menu.menuOptionsScan, menu.menuOptionsResidentsToGuard, menu.menuOptionsVisitor, menu.menuOptionsService, menu.menuOptionsCarGuard, menu.menuOptionsEventGuard, menu.menuOptionsSlot]
    profiles[Constants.USER_KIND['SUPERINTENDENT']]=[menu.menuOptionsQRCode, menu.menuOptionsScan, menu.menuOptionsUnits, menu.menuOptionsResidents, menu.menuOptionsVisitor, menu.menuOptionsService, menu.menuOptionsGuard, menu.menuOptionsCarSuperIntendent, menu.menuOptionsEventSuperintendent, menu.menuOptionsSlot]
    profiles[Constants.USER_KIND['ADM']]=[menu.menuOptionsCondo, menu.menuOptionsSindico]

    const getArrayOptionsWithSubmenu = _ => {
        return Object.values(menu).filter(el=> el.submenuOptions)
    }

    const getDivCard = el => {
        return (
            <div className="col">
                <div className={`${classes.Card}`} style={{background: Constants.backgroundColors[el.code] || 'black', border: `4px solid ${Constants.backgroundDarkColors[el.code] || 'black'}`}}>
                    <div className={classes.Icon} style={{background: Constants.backgroundLightColors[el.code] || 'black'}}>
                        <Icon icon={el.icon} size='3x'/>
                    </div>
                    <div className={`${classes.Card_Footer}`} style={{background: Constants.backgroundLightColors[el.code] || 'black'}}>
                        <p className={classes.TextCard}>
                            {el.menuName}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Fragment>
            <Header/>
            <main className={`${classes.Dashboard}`}>
                <Greeting user={user}/>
                <div className={`container ${classes.Dashboard}`}>
                    <div className={`row row-cols-2 row-cols-md-4 row-cols-lg-4 g-3 g-md-3 g-lg-5 mt-2 text-center ${profiles[user.user_kind].length <=3 && 'justify-content-center'}`}>
                        {profiles[user.user_kind].map(el=>{
                            if(el.submenuOptions){
                                    return (
                                        <div key={el.key} onClick={()=>el.toggle(prev=>!prev)}>
                                            {getDivCard(el)}
                                        </div>
                                    )
                            }
                            else{
                                return (
                                    <Link to={`/${el.url.toLowerCase()}`} key={el.key}>
                                        {getDivCard(el)}
                                    </Link>
                                )
                            }
                        })}
                    </div>
                </div>
            </main>
            
            {
                getArrayOptionsWithSubmenu().map(el=> {
                    return (
                        <div key={`modal${el.key}`}>
                            <Modal isOpen={el.modal} toggle={()=>el.toggle(prev=>!prev)} centered={true}>
                                <ModalHeader toggle={()=>el.toggle(prev=>!prev)}>{el.menuName}</ModalHeader>
                                <ModalBody>
                                    <div className='row text-center justify-content-center'>
                                        {
                                            el.submenuOptions.map(sm=>{
                                                return (
                                                    <div key={el.key+sm.icon} className="col-md-4 col-lg-4 col-sm-6 col-xs-12 mb-2">
                                                        <Link to={`/${el.url.toLowerCase()}/${sm.url.toLowerCase()}`}>
                                                            <div className={`${classes.Card}`} style={{background: Constants.backgroundColors[el.code], border: `4px solid ${Constants.backgroundDarkColors[el.code]}`}}>
                                                                <div className={classes.Icon} style={{background: Constants.backgroundLightColors[el.code]}}>
                                                                    <Icon icon={sm.icon} size='3x'/>
                                                                </div>
                                                                <div className={`${classes.Card_Footer}`} style={{background: Constants.backgroundLightColors[el.code]}}>
                                                                    <p className={classes.TextCard}>
                                                                        {sm.menuName}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </ModalBody>
                            </Modal>
                        </div>
                    )
                })
            }
            
            
        </Fragment>
    );
};

export default Dashboard;