import React from 'react';
import { USER_KIND_NAME } from '../../../services/constants';

const AccessLineInfo = (props) => {
  const getAccess = _ => {
    return <span>
      <p className='enfase mb-0'>Usuários</p>
      {
        props.access.UserAccesses.map((ac, ind)=> {
          return (
            <div className={ind !== 0 && 'border-top'}>
              <p className='p-0 m-0'>{ind+1}. {ac.name}</p>
              {!!ac.identification && <p className='p-0 m-0'>ID: {ac.identification}</p>}
              {!!ac.company && <p className='p-0 m-0 mb-2'>Empresa: {ac.company}</p>}
            </div>
          )
        })
      }
      {!!props.access.VehicleAccesses?.length && <p className='enfase mt-4 mb-0'>Veículos</p>}
      {
        !!props.access.VehicleAccesses?.length && props.access.VehicleAccesses.map((va, ind)=> {
          return (
            <div className={ind !== 0 && 'border-top'}>
              <p className='p-0 m-0'>{ind+1}.{va.maker} {va.model} {va.color}</p>
              <p className='p-0 m-0'>Placa: {va.plate}</p>
            </div>
          )
        })
      }
      
    </span>
  }

  return (
    <tr>
      <th scope="row">
        {props.index}
      </th>
      <td>
        {new Date(props.access.updatedAt).toLocaleString()}
      </td>
      <td>
        {props.access.TypeAccess.type}
      </td>
      <td>
        {getAccess()}
      </td>
      <td>
        {USER_KIND_NAME[props.access.user_kind_id]}
      </td>
      <td>
        <span>Bloco {props.access.bloco_name}<br />Unidade {props.access.unit_number}</span>
      </td>
      <td>
        {props.access.ControllerAccess.name} <br /><i>{USER_KIND_NAME[props.access.ControllerAccess.user_kind_id]}</i>
      </td>
    </tr>
  );
};

export default AccessLineInfo;