import React, {useState} from 'react';
import genericProfile from '../../Images/generic-profile.png'

const ImageBlob = (props) => {
    const [source, setSource] = useState(props.path)

    return (
        !!props.path ?
            <img 
                src={URL.createObjectURL(source)} 
                loading='lazy' 
                alt='user'
                height={props.height || '250'} 
                onError={(err)=>{console.log(err); setSource(genericProfile)}}
            />
        :
            <img 
                src={genericProfile} 
                loading='lazy' 
                alt='user'
                height={props.height || '250'} 
                onError={(err)=>{console.log(err); setSource(genericProfile)}}
            />
    );
};

export default ImageBlob;