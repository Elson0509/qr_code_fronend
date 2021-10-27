import React, {useState, useEffect, Fragment} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Icon from '../../Icon'

const PicModal = (props) => {
    const [playing, setPlaying] = useState(true)
    const [imgPath, setImgPath] = useState('')

    const HEIGHT = 250;
    const WIDTH = HEIGHT / 4 * 3;

    useEffect(()=>{
        if(props.takePic)
            startVideo()
    }, [props.takePic])

    const startVideo = _ =>{
        setPlaying(true)
        navigator.getUserMedia(
			{
				video: true,
			},
			(stream) => {
				let video = document.getElementsByClassName('app__videoFeed')[0];
				if (video) {
					video.srcObject = stream;
				}
			},
			(err) => console.error(err)
		);
    }

    const clickPicHandler = () => {
        captureVideo()
        stopVideo()
        setPlaying(false)
    }

    const confirmPicHandler = () => {
        props.setImgPath(imgPath)
        props.confirmTakePick()
    }

    const stopVideo = _ => {
        setPlaying(false)
        let video = document.getElementsByClassName('app__videoFeed')[0];
        if(video)
		    video.srcObject.getTracks()[0].stop();
    }

    const captureVideo = _ => {
        const canvas = document.createElement("CANVAS");
        var video = document.getElementsByClassName('app__videoFeed')[0];
        canvas.height = video.videoHeight;
        canvas.width = video.videoHeight/4*3;
        canvas.getContext('2d').drawImage(video, (video.videoWidth - (video.videoHeight/4*3))/2, 0, video.videoHeight/4*3, video.videoHeight, 0, 0, video.videoHeight/4*3, video.videoHeight);  
        setImgPath(canvas.toDataURL("image/jpeg"))
    }

    const toggle = _ => {
        stopVideo()
        props.toggle()
    }

    return (
        <Modal isOpen={props.modal} toggle={()=>toggle()} className={props.className}>
            <ModalHeader toggle={()=>toggle()}>Tirar Foto</ModalHeader>
            <ModalBody className='text-center'>
            {
                playing && (
                <div style={{position: 'relative'}}>
                    <div style={{
                        border: '4px dashed red',
                        position: 'absolute',
                        height: HEIGHT,
                        width: WIDTH,
                        left: 0,
                        right: 0,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}>

                    </div>
                    <video
                        style={{border: '1px solid white'}}
                        height={HEIGHT}
                        muted
                        autoPlay
                        className='app__videoFeed'
                    />
                </div>
                )
                
            }
            {
                !playing && !!imgPath && (
                    <img src={imgPath} height={HEIGHT}/>
                )
            }
            </ModalBody>
            <ModalFooter className='text-center'>
                {playing && (
                    <Fragment>
                        <Button color="primary" style={{margin: '0 auto'}} onClick={()=>clickPicHandler()}>
                            <Icon icon='camera' color='white' size='lg'/>
                        </Button>
                    </Fragment> 
                )}   
                {!playing && !!imgPath && (
                    <Fragment>
                        <Button color="warning" style={{margin: '0 auto'}} onClick={()=>startVideo()}>
                            <Icon icon='redo' color='white' size='lg'/>
                        </Button> 
                        <Button color="success" style={{margin: '0 auto'}} onClick={()=>confirmPicHandler()}>
                            <Icon icon='check' color='white' size='lg'/>
                        </Button> 
                    </Fragment>  
                )}
            </ModalFooter>
        </Modal>
    );
};

export default PicModal;