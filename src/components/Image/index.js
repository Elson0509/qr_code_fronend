import React, {useState} from 'react';
import genericProfile from '../../Images/generic-profile.png'
import * as Constants from '../../services/constants'

const Image = (props) => {
    const [source, setSource] = useState(`${Constants.API_URL_PREFIX}/${Constants.API_URL}/img/${props.id}.jpg`)

    return (
        <img src={source} loading='lazy' height={props.height || '250'} onError={(err)=>{console.log(err); setSource(genericProfile)}}/>
    );
};

export default Image;