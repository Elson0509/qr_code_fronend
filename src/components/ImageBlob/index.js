import React, {useState} from 'react';
import genericProfile from '../../Images/generic-profile.png'
import * as Constants from '../../services/constants'

const ImageBlob = (props) => {
    const [source, setSource] = useState(props.path)

    return (
        <img src={source} loading='lazy' height={props.height || '250'} onError={(err)=>{console.log(err); setSource(genericProfile)}}/>
    );
};

export default ImageBlob;