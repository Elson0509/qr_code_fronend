import React, { Fragment, useState } from 'react'
import HeaderLanding from '../../layout/Landing/HeaderLanding';
import Footer from '../../layout/Footer';
import Nav from '../../layout/Landing/Nav';
import Landscape from '../../layout/Landing/Landscape';
import { Card, CardHeader, Collapse, CardBody } from 'reactstrap'

const Faq = () => {
  const [collapse, setCollapse] = useState(null)

  const questions = [
    {
      question: 'O que é QR Condo?',
      answer: 'QR Condo é uma solução de controle de acesso para condomínios. Ela pode ser acessada pela internet ou por aplicativo de celular.',
    },
    {
      question: 'Quais funcionalidades oferece?',
      answer: 'Com a QR Condo, é possível cadastrar os blocos e unidades do condomínio, seus moradores e respectivos veículos, colaboradores do condomínio, visitantes e terceirizados, bem como registrar operações de pernoite, ronda e controle de vagas de estacionamento. Além disso, há o reconhecimento rápido por meio de leitura de QR Code.',
    },
    {
      question: 'Cite um exemplo do uso de QR Code',
      answer: 'Como exemplo, o morador que vai acessar o prédio pode mostrar seu QR Code (que a plataforma disponibiliza para ele através do aplicativo). O colaborar utiliza seu aplicativo para ler o QR Code do morador, identificando rapidamente seu nome, foto, bloco, unidade e veículos cadastrados.',
    },
    {
      question: 'Quem e como se acessa a plataforma?',
      answer: 'O Administrador, os moradores e os colaboradores possuem login próprio no sistema. Cada um deles possui funcões diferentes.',
    },
    {
      question: 'Como funciona o cadastro de visitantes?',
      answer: 'O morador que pretende receber um visitante pode enviar as informações dele (nome, identidade, foto, veículo e prazo de visita) para o administrador do prédio, que cadastrará estes dados na plataforma, gerando um QR Code que poderá ser compartilhado com o visitante. Este visitante, ao se apresentar no condomínio, mostrará seu QR Code para o colaborador, que vai automaticamente identificá-lo e autorizará sua entrada. Caso o morador não tenha feito o pedido de cadastro prévio, o colaborador do condomínio poderá cadastrar o visitante e autorizar sua entrada.',
    },
    {
      question: 'Como funciona o cadastro de terceirizados?',
      answer: 'O morador que pretende receber um terceirizado pode enviar as informações dele (nome, identidade, foto, empresa, veículo e prazo de visita) para o administrador do prédio, que cadastrará estes dados na plataforma, gerando um QR Code que poderá ser compartilhado com o terceirizado. Este terceirizado, ao se apresentar no condomínio, mostrará seu QR Code para o colaborador, que vai automaticamente identificá-lo e autorizará sua entrada. Caso o morador não tenha feito o pedido de cadastro prévio, o colaborador do condomínio poderá cadastrar o terceirizado e autorizar sua entrada.',
    },
  ]

  const toggle = e => {
    const event = e.target.dataset.event;
    setCollapse(collapse === Number(event) ? null : Number(event));
  }

  return (
    <Fragment>
      <HeaderLanding />
      <Nav />
      <section className='p-4'>
        {
          questions.map((el, index) => {
            return (
              <Card style={{ marginBottom: '1rem', textAlign: 'justify' }} key={index} className='roboto'>
                <CardHeader onClick={toggle} data-event={index}  style={{ cursor: 'pointer' }}>
                  {el.question}
                </CardHeader>
                <Collapse isOpen={collapse === index}>
                  <CardBody><p>{el.answer}</p></CardBody>
                </Collapse>
              </Card>
            )
          })
        }
      </section>
      <Landscape />
      <Footer />
    </Fragment>
  );
};

export default Faq;