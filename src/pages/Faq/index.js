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
      answer: 'QR Condo é uma solução moderna de controle de acesso para condomínios. Ela pode ser acessada pela internet ou por aplicativo de celular.',
    },
    {
      question: 'Quais funcionalidades oferece?',
      answer: 'Com a QR Condo, é possível cadastrar blocos e unidades do condomínio, seus moradores e respectivos veículos, colaboradores do condomínio, visitantes e terceirizados, bem como registrar operações de pernoite, ronda e controle de vagas de estacionamento. Além disso, há o reconhecimento rápido por meio de leitura de QR Code.',
    },
    {
      question: 'Cite um exemplo do uso de QR Code',
      answer: 'Como exemplo, o morador que vai acessar o prédio pode mostrar seu QR Code (que a plataforma disponibiliza para ele através do aplicativo). O colaborar utiliza seu aplicativo para ler o QR Code do morador, identificando rapidamente seu nome, foto, bloco, unidade e veículos cadastrados.',
    },
    {
      question: 'Quem e como se acessa a plataforma?',
      answer: 'O Administrador, os moradores e os colaboradores possuem login próprio no sistema. Cada um deles possui funções diferentes.',
    },
    {
      question: 'Como eu, administrador do condomínio, posso ter acesso ao sistema?',
      answer: 'Você entra em contato conosco e, após a contratação so serviço, os administradores do condomínio terão acesso ao sistema por meio de um login próprio.',
    },
    {
      question: 'Posso registrar múltiplos administradores?',
      answer: 'Sim. Caso seu condomínio possua uma equipe para administrá-lo, pode-se cadastrar diversos administradores, sem custo adicional.',
    },
    {
      question: 'Como funciona o cadastro de blocos e unidades?',
      answer: 'O administrador do prédio cadastra os blocos e suas respectivas unidades. Quando se cadastra um bloco, o sistema irá sugerir um cadastro automático de unidades de acordo com o menor e o maior número da unidade (por exemplo, o bloco começa na unidade 101A e termina na unidade 412D), o que agiliza o processo de cadastro de unidades.',
    },
    {
      question: 'Como funciona o cadastro de moradores?',
      answer: 'Com os blocos e unidades cadastradas, o administrador adiciona os moradores e seus respectivos veículos. Quando adiciona um morador, o sistema irá fornecê-lo via email um convite para acessar o sistema por um login próprio. Com acesso ao sistema, o morador terá seu próprio QR Code para se identificar rapidamente para os colaboradores ao acessar o condomínio.',
    },
    {
      question: 'Como funciona o cadastro de colaboradores?',
      answer: 'Os colaboradores (segurança, recepcionistas, etc) poderão ser cadastrados pelo administrador. Ao serem cadastrados, eles terão acesso ao sistema, com funcionalidades próprias como leitura de QR Code, acessar lista de moradores, visitantes e terceirizados, ronda, pernoite e controle de estacionamento.',
    },
    {
      question: 'Como funciona o cadastro de visitantes?',
      answer: 'O morador que pretende receber um visitante pode enviar as informações dele (nome, identidade, foto, veículo e prazo de visita) para o administrador do prédio, que cadastrará estes dados na plataforma, gerando um QR Code que poderá ser compartilhado com o visitante. Este visitante, ao se apresentar no condomínio, mostrará seu QR Code para o colaborador, que vai automaticamente identificá-lo e autorizará sua entrada. Caso o morador não tenha feito o pedido de cadastro prévio, o colaborador do condomínio poderá cadastrar o visitante e autorizar sua entrada.',
    },
    {
      question: 'Como funciona o cadastro de terceirizados?',
      answer: 'O morador que pretende receber um terceirizado (marceneiro, maquiador, mecânico, montador, etc) pode enviar as informações dele (nome, identidade, foto, empresa, veículo e prazo de visita) para o administrador do prédio, que cadastrará estes dados na plataforma, gerando um QR Code que poderá ser compartilhado com o terceirizado. Este terceirizado, ao se apresentar no condomínio, mostrará seu QR Code para o colaborador, que vai automaticamente identificá-lo e autorizará sua entrada. Caso o morador não tenha feito o pedido de cadastro prévio, o colaborador do condomínio poderá cadastrar o terceirizado e autorizar sua entrada.',
    },
    {
      question: 'O que é a função pernoite?',
      answer: 'É uma função disponível para os colaboradores e administradores. Por meio dela, é possível identificar rapidamente os veículos estacionados no prédio, conferindo se realmente pertencem a um morador. Caso não pertença ou caso haja uma observação a ser feita, pode-se registrar uma ocorrência, enviando uma mensagem e fotos. Enquanto o colaborar registra, o administrador poderá acessar a lista de ocorrências posteriormente.',
    },
    {
      question: 'O que é a função ronda?',
      answer: 'É uma função disponível para os colaboradores e administradores. Por meio dela, é possível registrar ocorrências, incluindo o assunto, local, descrição e fotos. Enquanto o colaborar registra, o administrador poderá acessar a lista de ocorrências posteriormente.',
    },
    {
      question: 'O que é o controle de estacionamento?',
      answer: 'É uma função disponível para os colaboradores e administradores. Por meio dela, é possível controlar a quantidade de vagas para visitantes disponíves no condomínio. Toda vez que é registrada a entrada de um visitante ou um prestador de serviço, o sistema poderá registrar se eles utilizarão vagas de estacionamento. Há qualquer momento, o colaborador pode checar no sistema qual a quantidade de vagas livres.',
    },
    {
      question: 'Onde são armazenadas as informações?',
      answer: 'As dados são armazenados de forma segura em nuvem, com acesso restrito aos usuários da plataforma. Assim, você não precisa comprar nenhum equipamento especial para armazenar informações em seu condomínio. Tudo o que você precisa é de computador ou celular com acesso a internet.',
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
      <section className='p-4 bg-light'>
        <h3 className='h3 mb-4 roboto'>Perguntas frequentes</h3>
        {
          questions.map((el, index) => {
            return (
              <Card style={{ marginBottom: '1rem', textAlign: 'justify' }} key={index} className='roboto'>
                <CardHeader onClick={toggle} data-event={index} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                  {index + 1}. {el.question}
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