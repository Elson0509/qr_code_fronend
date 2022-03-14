import React from 'react';
import bgShowCase3 from '../../../Images/showcase-3.jpg'
import bgShowCase4 from '../../../Images/showcase-4.jpg'
import bgShowCase6 from '../../../Images/showcase-6.jpg'
import classes from './Showcase.module.css'

const Showcase = () => {
  return (
    <section>
      <div className='container-fluid'>
        <div className='row'>
          <div className={`col-lg-6 order-lg-2 ${classes.ShowcaseImg}`} style={{ backgroundImage: `url(${bgShowCase3})` }} />
          <div className={`col-lg-6 my-auto order-lg-1 ${classes.ShowcaseText}`}>
            <h2>Login de acesso</h2>
            <p className="lead mb-0">Administradores, colaboradores e moradores possuem login de acesso ao sistema para gerenciar funções de acordo com seu perfil.</p>
          </div>
        </div>
        <div className='row'>
          <div className={`col-lg-6 ${classes.ShowcaseImg}`} style={{ backgroundImage: `url(${bgShowCase4})` }} />
          <div className={`col-lg-6 my-auto ${classes.ShowcaseText}`}>
            <h2>Cadastro de moradores</h2>
            <p className="lead mb-0">Administradores poderão cadastrar os blocos, unidades e seus respectivos residentes, que poderão se indentificar por meio de QR Code ou serem identificados rapidamente pelos colaboradores do condomínio, aumentando o nível de segurança.</p>
          </div>
        </div>
        <div className='row'>
          <div className={`col-lg-6 order-lg-2 ${classes.ShowcaseImg}`} style={{ backgroundImage: `url(${bgShowCase6})` }} />
          <div className={`col-lg-6 my-auto order-lg-1 ${classes.ShowcaseText}`}>
            <h2>Veículos</h2>
            <p className="lead mb-0">Carros são cadastrados de acordo com o modelo, cor, placa e a unidade que pertencem. Além disso, há o controle da quantidade de vagas para visitantes.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showcase;