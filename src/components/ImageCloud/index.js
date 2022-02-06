import React from 'react';
import genericProfile from '../../Images/generic-profile.png'
import * as Constants from '../../services/constants'

const ImageCloud = (props) => {
    return (
        props.id ?
        <img src={Constants.PREFIX_IMG_GOOGLE_CLOUD + props.id} alt='user' loading='lazy' height={props.height || '250'}/>
        :
        <img src={genericProfile} alt='user' loading='lazy' height={props.height || '250'}/>
    );
};

export default ImageCloud;