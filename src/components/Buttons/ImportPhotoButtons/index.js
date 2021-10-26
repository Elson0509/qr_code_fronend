import React from 'react';
import Icon from '../../Icon';
import classes from './ImportPhotoButtons.module.css'

const ImportPhotoButtons = (props) => {
    return (
        <div className={classes.MainDiv}>
            <div>
                <p className='text-center fs-5 fw-bold'>Adicionar foto</p>
            </div>
            <div className={classes.DivButtons}>
                {/* <input id="file" style={{display: 'none'}} type="file" accept="image/jpeg" onChange={(ev)=>{props.setImgPath(URL.createObjectURL(ev.target.files[0]))}}/> */}
                <input id="file" style={{display: 'none'}} type="file" accept="image/jpeg" onChange={(ev)=>{props.paperClipImageHandler(URL.createObjectURL(ev.target.files[0]))}}/>
                <label className={classes.Button} htmlFor='file'>
                    <Icon icon='paperclip' size='2x' color='white'/>
                </label>

                <div className={classes.Button} onClick={props.cameraClick}>
                    <Icon icon='camera' size='2x' color='white'/>
                </div>
            </div>
            
        </div>
    );
};

export default ImportPhotoButtons;