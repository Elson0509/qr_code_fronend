import React, {useState, Fragment, useCallback, useEffect} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Icon from '../../Icon'
import Cropper from 'react-easy-crop';

const CropImageModal = (props) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const img = new Image()
    img.src=props.pathImgToCrop

    const confirmHandler = _ => {
        const canvas = document.createElement('canvas')
        const image = document.createElement('img')
        image.src = props.pathImgToCrop
        const pixelRatio = window.devicePixelRatio
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        const ctx = canvas.getContext('2d')

        canvas.width = croppedAreaPixels.width * pixelRatio * scaleX;
        canvas.height = croppedAreaPixels.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            croppedAreaPixels.x * scaleX,
            croppedAreaPixels.y * scaleY,
            croppedAreaPixels.width * scaleX,
            croppedAreaPixels.height * scaleY,
            0,
            0,
            croppedAreaPixels.width * scaleX,
            croppedAreaPixels.height * scaleY
        );

        //props.setImgPath(canvas.toDataURL("image/jpeg"))

        canvas.toBlob(blob=>{
            //console.log({blob})
            props.setImgPath(blob)
        })

        props.setModalCrop(false)
    }

    return (
        <Modal isOpen={props.modal} toggle={()=>props.setModalCrop(false)} className={props.className}>
            <ModalHeader toggle={()=>props.setModalCrop(false)} >Cortar imagem</ModalHeader>
            <ModalBody className='text-center' style={{height: 400}}>
                <div>
                <Cropper
                    image={props.pathImgToCrop}
                    crop={crop}
                    zoom={zoom}
                    aspect={img.height ? img.width / img.height : 1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
                </div>
            </ModalBody>
            <ModalBody className='text-center'>
                <div>
                    <h5 className='h5'>Zoom</h5>
                    <input type="range" min="1" max="3" value={zoom} onChange={(ev)=>setZoom(Number(ev.target.value))} step="0.1" style={{width: '100%'}} />
                </div>
            </ModalBody>
            <ModalFooter className='text-center'>
                <Fragment>
                    <Button color="danger" style={{margin: '0 auto'}} onClick={()=>{props.setModalCrop(false)}}>
                        <Icon icon='window-close' color='white' size='lg'/>
                    </Button> 
                    <Button color="success" style={{margin: '0 auto'}} onClick={()=>{confirmHandler()}}>
                        <Icon icon='check' color='white' size='lg'/>
                    </Button> 
                </Fragment>  
            </ModalFooter>
        </Modal>
    );
};

export default CropImageModal;