import React from 'react';
import Body from '../../layout/Body';
import QRCode from 'qrcode.react'
import { useAuth } from '../../contexts/auth'
import * as Constants from '../../services/constants'

const MyQrCode = (props) => {
    const {user} = useAuth()

    const breadcrumb=[
        {
            name: 'Painel Principal',
            link: '/'
        },
        {
            name: 'Meu QR Code',
            link: '/myqrcode'
        }
    ]

    return (
        <Body breadcrumb={breadcrumb}>
            <div className='row'>
                <div className='col-12 text-center mb-4'>
                    <h4 className='h4 mb-4'>Utilize o QR Code abaixo para se identificar</h4>
                    <QRCode value={`${Constants.QR_CODE_PREFIX}${user.id}`} style={{width: '70%', height: 'auto', maxWidth: 500}}/>
                </div>
            </div>
        </Body>
    );
};

export default MyQrCode;