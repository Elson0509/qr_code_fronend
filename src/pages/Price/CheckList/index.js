import React from 'react';
import Icon from '../../../components/Icon'

const CheckList = (props) => {
    return (
        <ul className="list-unstyled mt-3 mb-4 border py-2">
            <li><Icon icon='check' color='green' size='xs' /> {props.text}</li>
            <li><Icon icon='check' color='green' size='xs' /> Acesso do aplicativo de celular e pelo site</li>
            <li><Icon icon='check' color='green' size='xs' /> Cadastro de unidades, moradores e veículos</li>
            <li><Icon icon='check' color='green' size='xs' /> Registro de pernoite e ocorrências</li>
            <li><Icon icon='check' color='green' size='xs' /> Envio de imagens</li>
        </ul>
    );
};

export default CheckList;