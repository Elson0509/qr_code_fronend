import React from 'react';
import { USER_KIND_NAME } from '../../../services/constants';

const AccessLine = (props) => {
  const Unit = props.reading.Unit
  const User = props.reading.userRead

  const getRegister = _ => {
    if (!props.reading.is_success) {
      return 'NEGADO'
    }
    if (User) {
      return 'LEITURA'
    }
    return props.reading.is_entrance ? 'ENTRADA' : 'SAÍDA'
  }

  const getType = _ => {
    if (!props.reading.is_success) {
      return '---'
    }
    return Unit ?
      USER_KIND_NAME[Unit.unit_kind_id]
      :
      USER_KIND_NAME[1]
  }

  const getUnit = _ => {
    if (!props.reading.is_success) {
      return '---'
    }
    return Unit ?
      <span>Bloco {Unit.Bloco.name}<br />Unidade {Unit.number}</span>
      :
      User.Unit ?
        <span>Bloco {User.Unit.Bloco.name}<br />Unidade {User.Unit.number}</span>
        :
        '---'
  }

  const getAccessDetails = _ => {
    if (!props.reading.is_success) {
      return '---'
    }
    if(User){
      return User.name
    }
    return <span>
      {
        Unit.Users.map((user, index) => {
          return <span key={index}>{user.name}<br /></span>
        })
      }
      {
        Unit.Vehicles.map((vehicle, index) => {
          return <span key={index}>{vehicle.maker} {vehicle.model} {vehicle.color} {vehicle.plate}<br /></span>
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
        {new Date(props.reading.updatedAt).toLocaleString()}
      </td>
      <td>
        {getRegister()}
      </td>
      <td>
        {getAccessDetails()}
      </td>
      <td>
        {getType()}
      </td>
      <td>
        {getUnit()}
      </td>
      <td>
        {props.reading.userModify.name} <br /><i>({USER_KIND_NAME[props.reading.userModify.user_kind_id]})</i>
      </td>
    </tr>
  );
};

export default AccessLine;