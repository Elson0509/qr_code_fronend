import React, {Fragment} from 'react';
import {useAuth} from '../../contexts/auth';
import Header from '../../layout/Header'
import * as Constants from '../../services/constants'
import Icon from '../../components/Icon';
import classes from './dashboard.module.css'
import { Link } from 'react-router-dom'

const Dashboard = () => {

    const { user } = useAuth()

    const menuOptionsQRCode = { menuName: "Meu QR Code", icon: 'qrcode', key: 'QRCode', url: 'MyQRCode', backgroundColor: Constants.backgroundColors['MyQRCode'] }
    const menuOptionsScan = { menuName: "Escanear", icon: 'camera', key: 'Scan', url: 'Scan', backgroundColor: Constants.backgroundColors['Scan'] }
    const menuOptionsUnits = { menuName: "Unidades", icon: 'building', key: 'building', url: 'Units', backgroundColor: Constants.backgroundColors['Units'] }
    const menuOptionsResidents = { menuName: "Moradores", icon: 'house-user', key: 'resident', url: 'Residents', backgroundColor: Constants.backgroundColors['Residents'] }
    const menuOptionsVisitor = { menuName: "Visitantes", icon: 'user-friends', key: 'visitor', url: 'Visitors', backgroundColor: Constants.backgroundColors['Visitors'] }
    const menuOptionsService = { menuName: "Terceirizados", icon: 'people-carry', key: 'service', url: 'Thirds', backgroundColor: Constants.backgroundColors['Thirds'] } //permissionário
    const menuOptionsGuard = { menuName: "Guardas", icon: 'user-shield', key: 'guard', url: 'Guards', backgroundColor: Constants.backgroundColors['Guards'] }
    const menuOptionsCarSuperIntendent = { menuName: "Pernoite", icon: 'car', key: 'car', url: 'Car', backgroundColor: Constants.backgroundColors['Cars'] }
    const menuOptionsCarGuard = { menuName: "Pernoite", icon: 'car', key: 'car', url: 'CarSearch', backgroundColor: Constants.backgroundColors['Cars'] }
    const menuOptionsEventResident = { menuName: "Ocorrências", icon: 'exclamation', key: 'event', url: 'EventAdd', backgroundColor: Constants.backgroundColors['Events'] }
    const menuOptionsEventGuard = { menuName: "Ronda", icon: 'exclamation', key: 'event', url: 'EventAdd', backgroundColor: Constants.backgroundColors['Events'] }
    const menuOptionsEventSuperintendent = { menuName: "Ronda", icon: 'exclamation', key: 'event', url: 'EventsGuard', backgroundColor: Constants.backgroundColors['Events'] }
    const menuOptionsSurvey = { menuName: "Avaliação", icon: 'smile', key: 'pesquisa', url: 'Survey', backgroundColor: Constants.backgroundColors['Survey'] }
    const menuOptionsInfo = { menuName: "Informações", icon: 'info-circle', key: 'info', url: 'Info', backgroundColor: Constants.backgroundColors['Info'] }

    const profiles = []
    profiles[Constants.USER_KIND['RESIDENT']]=[menuOptionsQRCode, menuOptionsEventResident, menuOptionsSurvey]
    profiles[Constants.USER_KIND['GUARD']]=[menuOptionsQRCode, menuOptionsScan, menuOptionsResidents, menuOptionsVisitor, menuOptionsService, menuOptionsCarGuard, menuOptionsEventGuard]
    profiles[Constants.USER_KIND['SUPERINTENDENT']]=[menuOptionsQRCode, menuOptionsScan, menuOptionsUnits, menuOptionsResidents, menuOptionsVisitor, menuOptionsService, menuOptionsGuard, menuOptionsCarSuperIntendent, menuOptionsEventSuperintendent]

    console.log(user)

    return (
        <Fragment>
            <Header/>
            <main className='container'>
                <div className='row row-cols-2 row-cols-md-4 row-cols-lg-4 g-3 g-md-3 g-lg-5 mt-2 text-center'>
                    {profiles[user.user_kind].map(el=>{
                        return (
                            <Link to={`/${el.url.toLowerCase()}`} key={el.key}>
                                <div className="col">
                                    <div className={`${classes.Card}`} style={{background: el.backgroundColor}}>
                                        <div className={classes.Icon}>
                                            <Icon icon={el.icon} size='3x'/>
                                        </div>
                                        <p className={classes.TextCard}>
                                            {el.menuName}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
                
            </main>

            
            
        </Fragment>
    );
};

export default Dashboard;