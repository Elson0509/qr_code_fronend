import React from 'react';
import genericProfile from '../../Images/generic-profile.png'
import genericEvent from '../../Images/generic-event.png'
import * as Constants from '../../services/constants'

const ImageCloud = (props) => {
    if (props.id) {
        return <img
            src={Constants.PREFIX_IMG_GOOGLE_CLOUD + props.id}
            alt='user'
            loading='lazy'
            height={props.height || '250'}
        />
    }
    else {
        if (props.isEvent) {
            return <img
                src={genericEvent}
                alt='user'
                loading='lazy'
                height={props.height || '250'}
            />
        }
        else {
            return <img
                src={genericProfile}
                alt='user'
                loading='lazy'
                height={props.height || '250'}
            />
        }
    }
};

export default ImageCloud;