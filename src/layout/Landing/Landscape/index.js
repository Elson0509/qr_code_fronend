import React, { useState } from 'react';
import classes from './Landscape.module.css'
import bg from '../../../Images/landscape.jpg'
import ModalEmail from '../../../components/Modals/ModalEmail';

const Landscape = () => {
  const [modalEmail, setModalEmail] = useState(false)

  return (
    <section className={classes.Landscape} style={{ background: `url(${bg}) no-repeat center center` }}>
      <h4 className='text-light h1 roboto'>Pronto para enviar uma mensagem?</h4>
      <p className={`text-light ${classes.Text} roboto`}>Adoraríamos conversar com você sobre como ajudar na implementação do sistema de controle de acesso em seu condomínio.</p>
      <button className='btn btn-primary' onClick={() => setModalEmail(true)}>Mensagem</button>
      <ModalEmail modalEmail={modalEmail} setModalEmail={setModalEmail}/>
    </section>
  );
};

export default Landscape;