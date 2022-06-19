import React from 'react';
import { Table } from 'reactstrap';
import AccessLineInfo from './AccessLineInfo'
import logo from '../../../Images/logo-h-min.jpg'

const AccessTable = (props) => {
  return (
    <div>
      <div className='to-print text-center my-4'>
        <img src={logo} alt='logo' width={300}/>
        <h2 className='h2 mt-2'>{props.title}</h2>
      </div>
      <Table
        borderless
        hover
        responsive
        striped
      >
        <thead>
          <tr>
            <th>
              #
            </th>
            <th>
              Horário
            </th>
            <th>
              Registro
            </th>
            <th>
              Acesso
            </th>
            <th>
              Tipo
            </th>
            <th>
              Unidade
            </th>
            <th>
              Controlador de Acesso
            </th>
          </tr>
        </thead>
        <tbody>
          {
            props.accesses.map((access, index) => {
              return (
                <AccessLineInfo
                  key={access.id}
                  index={props.page * 100 + index + 1 - 100}
                  access={access}
                />
              )
            })
          }
        </tbody>
      </Table>
    </div>
  );
};

export default AccessTable;