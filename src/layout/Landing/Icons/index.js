import React from 'react';
import classes from './Icons.module.css'
import Icon from '../../../components/Icon';

const Icons = () => {
    const iconSize = '4x'
    const iconColor = '#0d6efd'
    return (
        <section className={classes.Icons}>
            <div className={classes.IconDiv}>
                <Icon size={iconSize} color={iconColor} icon='qrcode'/>
                <h4 className='text-center'>QR Code</h4>
                <p className='text-center'>Identificação de moradores, visitantes, terceirizados e prestadores de serviço de forma moderna.</p>
            </div>
            <div className={classes.IconDiv}>
                <Icon size={iconSize} color={iconColor} icon='cloud-download-alt'/>
                <h4 className='text-center'>Dados na nuvem</h4>
                <p className='text-center'>Informação armazenada de forma segura, disponível para acesso em computadores e celulares.</p>
            </div>
            <div className={classes.IconDiv}>
                <Icon size={iconSize} color={iconColor} icon='building'/>
                <h4 className='text-center'>Controle de acesso</h4>
                <p className='text-center'>Registro de moradores e veículos para maior controle de entrada e saída do condomínio</p>
            </div>
        </section>
    );
};

export default Icons;