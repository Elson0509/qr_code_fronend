import {memo} from 'react';
import {library} from '@fortawesome/fontawesome-svg-core'
import {

} from '@fortawesome/free-brands-svg-icons'
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
    faWindowClose, //window-close
    faEdit, //edit
    faUser, //user
    faCarAlt, //car
    faPaperclip, //paperclip
    faRedo, //redo
    faCheck, //check
    faCalendar, //calendar
    faReply, //reply
    faEnvelope, //envelope
    faCity, //city
    faUsersCog, //users-cog
    faCarSide, //car-side
    faLevelUpAlt, //level-up-alt
    faLevelDownAlt, //level-down-alt
    faSignInAlt, //sign-in-alt
    faSignOutAlt, //sign-out-alt
    faThumbsUp, //thumbs-up
    faThumbsDown, //thumbs-down
    faShieldAlt, //shield,
    faHome, //home
    faShoppingBag, //shopping-bag
    faDollarSign, //dollar-sign
    faQuestion, //question
    faTimesCircle, //times-circle
    faCloudDownloadAlt, //cloud-download-alt
    faUserEdit, //user-edit
    faUserTimes, //user-times
    faPeopleArrowsLeftRight, //people-arrows-left-right
    faFilter, //filter
    faTableList, //table-list
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
    faWindowClose,
    faEdit,
    faUser,
    faCarAlt,
    faPaperclip,
    faRedo, 
    faCheck,
    faCalendar,
    faReply,
    faEnvelope,
    faCity,
    faUsersCog,
    faCarSide,
    faLevelUpAlt, 
    faLevelDownAlt,
    faSignInAlt,
    faSignOutAlt,
    faThumbsUp,
    faThumbsDown,
    faShieldAlt,
    faHome,
    faShoppingBag,
    faDollarSign,
    faQuestion,
    faTimesCircle,
    faCloudDownloadAlt,
    faUserEdit,
    faUserTimes,
    faPeopleArrowsLeftRight,
    faFilter,
    faTableList,
);

const Icon = (props) => {
    return (
        props.icon != null ?
            <FontAwesomeIcon 
                icon={props.icon} 
                size={props.size || '1x'} 
                color={props.color || 'black'}
            />
        :
        null
    );
};

export default memo(Icon);