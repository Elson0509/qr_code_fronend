import React, { useState, useEffect } from 'react';
import Body from '../../../layout/Body';
import { useAuth } from '../../../contexts/auth'
import * as Constants from '../../../services/constants'
import api from '../../../services/api'
import Icon from '../../../components/Icon';
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classes from './UnitAdd.module.css'

const UnitAdd = (props) => {
    const {user} = useAuth()
    const [loading, setLoading] = useState(true)
    const [modalSelectBloco, setModalSelectBloco] = useState(false)
    const [blocosApi, setBlocosApi] = useState(null)
    const [selectedBloco, setSelectedBloco] = useState(false)
    const [readOnlyBlocoInput, setReadOnlyBlocoInput] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [bloco, setBloco] = useState('')
    const [unit, setUnit] = useState('')

    const breadcrumb=[
        {
            name: 'Dashboard',
            link: '/'
        },
        {
            name: 'Adicionar Unidade',
            link: '/units/add'
        }
    ]

    useEffect(()=>{
        api.get(`/bloco/condo/${user.condo_id}`)
        .then(res=> {
          const newBloco = [{id:"0", name: 'Novo Bloco'}]
          setBlocosApi(newBloco.concat(res.data))
          console.log(newBloco.concat(res.data))
          setModalSelectBloco(true)
        })
        .catch((err)=>{
          toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (UA1)', Constants.TOAST_CONFIG)
        })
        .finally(()=>{
          setLoading(false)
        })
      },[])
    

    if(loading){
        return (
            <Body breadcrumb={breadcrumb}>
                <Spinner color="primary"/>
            </Body>
        )
    }

    const selectBlocoHandler = bloco =>{
        setModalSelectBloco(false)
        if(bloco.id!='0'){
          setBloco(bloco.name)
          setSelectedBloco(bloco)
          setReadOnlyBlocoInput(true)
        }
        else{
          setSelectedBloco({id: '0'})
        }
    }

    const confirmAddHandler = ev => {
        ev.preventDefault()
        const errors = []
        if(!bloco){
            return setErrorMessage('Bloco não pode estar vazio.')
        }
        if(!unit){
            return setErrorMessage('Apartamento não pode estar vazio.')
        }
        setLoading(true)
        api.post('/unit', {
            number: unit,
            bloco_id: selectedBloco.id,
            bloco_name: bloco,
            unit_kind_id: 1,
            user_id_last_modify: user.id,
            condo_id: user.condo_id,
        })
        .then((res)=>{
            setUnit('')
            toast.info(res.data.message, Constants.TOAST_CONFIG)
            })
        .catch((err)=> {
            toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (UA2)', Constants.TOAST_CONFIG)
            })
        .finally(()=>{
            setLoading(false)
        })
        
    }

    return (
        <Body breadcrumb={breadcrumb}>
            <div className='row'>
                <div className='col-12 pb-4'>
                    <form>
                        <div className="form-group">
                            <label>Bloco:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                aria-describedby="bloco" 
                                readOnly={readOnlyBlocoInput}
                                value={bloco}
                                onChange={(ev)=>setBloco(ev.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Unidade:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                aria-describedby="unidade"
                                value={unit}
                                onChange={(ev)=>setUnit(ev.target.value)}
                            />
                        </div>
                        {errorMessage && <div className="alert alert-danger my-4" role="alert">
                            {errorMessage}
                        </div>}
                        <button className="btn btn-primary mt-4" onClick={(ev)=>confirmAddHandler(ev)}>Confirmar</button>
                    </form>
                </div>
                
            </div>
            <Modal isOpen={modalSelectBloco} toggle={()=>setModalSelectBloco(prev=>!prev)}>
                    <ModalHeader toggle={()=>setModalSelectBloco(prev=>!prev)}>Selecione o bloco</ModalHeader>
                    <ModalBody>
                        <div className={classes.ButtonsDiv}>
                        {
                            !!blocosApi && (
                                blocosApi.map(el=>{
                                    if(el.id==='0')
                                        return (
                                            <button className={classes.ButtonBloco} onClick={()=> selectBlocoHandler(el)}>
                                                <Icon icon='plus-square' color='white'/>
                                                <span style={{marginLeft: '8px'}}>{el.name}</span>
                                            </button>
                                        )
                                    return (
                                        <button className={classes.ButtonBloco} onClick={()=> selectBlocoHandler(el)}>
                                            {el.name}
                                        </button>
                                    )
                                })
                            )
                        }
                        </div>
                    </ModalBody>
                </Modal>
        </Body>
    );
};

export default UnitAdd;