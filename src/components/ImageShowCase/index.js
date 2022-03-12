import React from 'react';
import classes from './ImageShowCase.module.css'
import Icon from '../Icon';

const ImageShowCase = (props) => {
  return (
    <div className={`row justify-content-center mx-1 ${classes.Gallery}`}>
      {
        props.images.map((el, ind) => (
          <div className={`col-lg-2 col-md-2 col-sm-3 col-4 py-2`} key={el.size+''+ind} >
            <div className={`col-12 ${classes.Img}`}>
              <img src={URL.createObjectURL(el)} alt='pic user' className={classes.ImageInGallery} />
            </div>
            <div className={classes.RemoveIcon} onClick={()=>props.removeImgHandler(ind)}>
              <Icon icon='times-circle' color='red' size='lg' />
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default ImageShowCase;