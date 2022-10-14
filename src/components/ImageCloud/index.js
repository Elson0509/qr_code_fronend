import React from 'react';
import genericProfile from '../../Images/generic-profile.png'
import genericEvent from '../../Images/generic-event.png'
import genericParcel from '../../Images/parcel.jpg'
import * as Constants from '../../services/constants'

const ImageCloud = (props) => {
  //console.log(Constants.PREFIX_IMG_GOOGLE_CLOUD + props.id)
  if (props.id) {
    return <img
      src={Constants.PREFIX_IMG_GOOGLE_CLOUD + props.id}
      alt='user'
      loading='lazy'
      height={props.height || 'auto'}
      width={props.width || '100%'}
    />
  }
  else {
    if (props.isEvent) {
      return <img
        src={genericEvent}
        alt='user'
        loading='lazy'
        height='auto'
        width='100%'
      />
    }
    else if (props.isParcel) {
      return <img
        src={genericParcel}
        alt='user'
        loading='lazy'
        height={props.height || 'auto'}
        width={props.width || '100%'}
      />
    }
    else {
      return <img
        src={genericProfile}
        alt='user'
        loading='lazy'
        height='auto'
        width='100%'
      />
    }
  }
};

export default ImageCloud;