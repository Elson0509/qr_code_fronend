import {Fragment, memo} from 'react';
import {library} from '@fortawesome/fontawesome-svg-core'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {
    faBuilding, /*building*/
    faQrcode, /*qrcode*/ 
    faCamera, //camera
    faHouseUser, //house-user
    faUserFriends, //user-friends
    faPeopleCarry, //people-carry
    faUserShield, //user-shield
    faCar, //car
    faExclamation, //exclamation
    faSmile, //smile
    faInfoCircle, //info-circle
    faCoffee, //coffee
    faSun, //sun
    faMoon, //moon
    faPlusSquare, //plus-square
    faListAlt, //list-alt
    faSearch, //search


} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

library.add(
    faBuilding,
    faQrcode,
    faCamera,
    faHouseUser,
    faUserFriends,
    faPeopleCarry,
    faUserShield,
    faCar,
    faExclamation,
    faSmile,
    faInfoCircle,
    faCoffee, 
    faSun,
    faMoon, 
    faPlusSquare,
    faListAlt,
    faSearch,
);

const Icon = (props) => {
    return (
        props.icon != null ?
            <Fragment>
                <FontAwesomeIcon 
                    icon={props.icon} 
                    size={props.size || '1x'} 
                    color={props.color || 'black'}
                    
                />
            </Fragment>
        :
        null
    );
};

export default memo(Icon);