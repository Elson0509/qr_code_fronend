import React from 'react';
import { Table } from 'reactstrap';
import AccessLineInfo from './AccessLineInfo'

const AccessTable = (props) => {
  return (
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
  );
};

export default AccessTable;