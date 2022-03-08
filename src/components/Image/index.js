import React, {useState} from 'react';
import genericProfile from '../../Images/generic-profile.png'

const Image = (props) => {
    const [source, setSource] = useState(`${process.env.REACT_APP_API_URL_PREFIX}/${process.env.REACT_APP_API_URL}/img/${props.id}.jpg`)

    return (
        <img src={source} alt='user' loading='lazy' height={props.height || '250'} onError={(err)=>{console.log(err); setSource(genericProfile)}}/>
    );
};

export default Image;