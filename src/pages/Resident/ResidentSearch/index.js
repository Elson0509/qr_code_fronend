import React, { useState, useEffect } from 'react';
import Body from '../../../layout/Body';
import { useAuth } from '../../../contexts/auth'
import * as Constants from '../../../services/constants'
import api from '../../../services/api'
import Plate from '../../../components/Plate'
import Image from '../../../components/Image'
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import {
    Card, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle, CardHeader,
  } from 'reactstrap';

const ResidentSearch = (props) => {
    const {user} = useAuth()
    const [units, setUnits] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchInput, setSearchinput] = useState('')

    const breadcrumb=[
        {
            name: 'Painel Principal',
            link: '/'
        },
        {
            name: 'Pesquisar Moradores',
            link: '/residents/search'
        }
    ]

    useEffect(()=>{
        fetchUsers()
    }, [])

    const fetchUsers = _ => {
        api.get(`user/condo/${user.condo_id}/${Constants.USER_KIND["RESIDENT"]}`)
        .then(resp=>{
          setUnits(resp.data)
        })
        .catch(err=>{
          toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RL1)', Constants.TOAST_CONFIG)
        })
        .finally(()=>{
          setLoading(false)
        })
    }

    const generateInfoUnits = _ =>{
        let unitsInfo = []
        units.forEach(bloco=>{
          bloco.Units.forEach(unit => {
            const unitInfo = {}
            unitInfo.bloco_id = bloco.id
            unitInfo.bloco_name = bloco.name
            unitInfo.residents = unit.Users
            unitInfo.vehicles = unit.Vehicles
            unitInfo.number = unit.number
            unitInfo.id = unit.id
            unitsInfo.push(unitInfo)
          })
        })

        if(searchInput){
            unitsInfo = unitsInfo.filter(el=>{
                
                return el.residents.some(res=>res.name.toLowerCase().indexOf(searchInput.toLowerCase()) != -1) ||
                    el.vehicles.some(vei=> vei.plate.toLowerCase().indexOf(searchInput.toLowerCase()) != -1)
            })
        }

        return unitsInfo
    }

    if(loading){
        return (
            <Body breadcrumb={breadcrumb}>
                <Spinner color="primary"/>
            </Body>
        )
    }

    return (
        <Body breadcrumb={breadcrumb}>
            <div className='row'>
                <div className='col-12'>
                <form>
                    <div class="form-group">
                        <label>Pesquisar</label>
                        <input type="email" className="form-control" placeholder="Nome ou placa" value={searchInput} onChange={(ev)=>setSearchinput(ev.target.value)}/>
                    </div>
                </form>
                {
                    generateInfoUnits().length === 0 && (
                        <div className="alert alert-danger my-4" role="alert">
                            Não há unidades que satisfazem a pesquisa
                        </div>
                    )
                }
                </div>
                    {
                        units.length>0 && (
                            generateInfoUnits().map(el=>(
                                <div className='col-lg-6 col-md-12 mb-4 p-2' key={el.id}>
                                    <Card body outline color="info">
                                        <CardHeader>
                                            <CardTitle tag="h4" className='text-center'>Bloco {el.bloco_name}</CardTitle>
                                            <CardSubtitle tag="h5" className="mb-2 text-muted text-center">Unidade {el.number}</CardSubtitle>
                                        </CardHeader>
                                        <CardBody>
                                            <CardText tag='h6'>Moradores:</CardText>
                                            {
                                                el.residents.length === 0 && (
                                                    <h6 className='h6 text-danger'>Sem moradores cadastrados</h6>
                                                )
                                            }
                                            {
                                                !!el.residents.length && el.residents.map((resident, ind)=>(
                                                    <div style={{border: '1px solid #ddd', paddingBottom: '10px'}}>
                                                        <div style={{display: 'flex', justifyContent:'center', paddingTop: '15px'}}>
                                                            <Image id={resident.id} height={150}/>
                                                        </div>
                                                        <p className='text-center p-0 m-0'>{resident.name}</p>
                                                        <p className='text-center p-0 m-0'>{resident.email}</p>
                                                    </div>
                                                ))
                                            }
                                        </CardBody>
                                        <CardBody>
                                            <CardText tag='h6' style={{borderTop: '3px solid #ddd', paddingTop: '10px'}}>Veículos Cadastrados:</CardText>
                                            {
                                                el.vehicles.length === 0 && (
                                                    <h6 className='h6 text-danger'>Sem veículos cadastrados</h6>
                                                )
                                            }
                                            {
                                                !!el.vehicles.length && el.vehicles.map((vehicle, ind)=> (
                                                  <div style={{borderBottom: ind === el.vehicles.length - 1 ? 'none' : '1px solid #ddd', paddingBottom: '10px'}}>
                                                    <p className='text-center'>{vehicle.maker} {vehicle.modle} {vehicle.color}</p>
                                                    <div style={{display: 'flex', justifyContent:'center'}}>
                                                      <Plate plate={vehicle.plate}/>
                                                    </div>
                                                  </div>
                                                ))
                                            }
                                        </CardBody>
                                    </Card>
                                </div>
                            ))
                        )
                    }
            </div>
        </Body>
    );
};

export default ResidentSearch;