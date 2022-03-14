import React from 'react';
import classes from './CarouselImages.module.css'
import { Carousel } from 'react-responsive-carousel';
import * as Constants from '../../services/constants'

const CarouselImages = (props) => {
  const clickItemHandler = item => {
    const itemPhotoId = props.images[item].photo_id
    props.clickHandler(itemPhotoId)
  }
  return (
    <Carousel dynamicHeight infiniteLoop showThumbs={false} className={classes.Carousel} onClickItem={clickItemHandler}>
      {
        props.images.map((el, ind)=>(
          <div key={el.photo_id}>
            <img src={Constants.PREFIX_IMG_GOOGLE_CLOUD + el.photo_id} className={classes.Img} alt={`Slide ${ind+1}`}/>
          </div>
        ))
      }
    </Carousel>
  );
};

export default CarouselImages;