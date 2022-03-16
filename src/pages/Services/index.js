import React, { Fragment } from 'react'
import HeaderLanding from '../../layout/Landing/HeaderLanding';
import Footer from '../../layout/Footer';
import Nav from '../../layout/Landing/Nav';
import Landscape from '../../layout/Landing/Landscape';
import { ListGroup, ListGroupItem } from 'reactstrap';

const Services = () => {
  const services = [
    {
      text:'Geral',
      active: true
    },
    {
      text:'Acesso das funcionalidades pelo site',
      active: false
    },
    {
      text:'Acesso das funcionalidades por aplicativo de celular',
      active: false
    },
    {
      text:'Acesso por email e senha',
      active: false
    },
    {
      text:'Disponibilidade de QR Code como identificador próprio do condomínio',
      active: false
    },
    {
      text:'Armazenamento de informações via nuvem',
      active: false
    },
    {
      text:'Armazenamento de fotos via nuvem',
      active: false
    },
    {
      text:'Moradores',
      active: true
    },
    {
      text:'Registro de ocorrências',
      active: false
    },
    {
      text:'Recebimento de respostas da administração',
      active: false
    },
    {
      text:'Colaboradores',
      active: true
    },
    {
      text:'Todas as funções de moradores',
      active: false
    },
    {
      text:'Escaneamento de QR Code',
      active: false
    },
    {
      text:'Listagem de moradores por bloco e unidade, com possibilidade de filtragem',
      active: false
    },
    {
      text:'Cadastro de visitantes e seus veículos',
      active: false
    },
    {
      text:'Listagem de visitantes por bloco e unidade, com possibilidade de filtragem',
      active: false
    },
    {
      text:'Cadastro de terceirizados e seus veículos',
      active: false
    },
    {
      text:'Listagem de terceirizados por bloco e unidade, com possibilidade de filtragem',
      active: false
    },
    {
      text:'Pesquisa de placas (função pernoite)',
      active: false
    },
    {
      text:'Registrar ocorrência de pernoite, com detalhes e fotos',
      active: false
    },
    {
      text:'Registrar ocorrência de ronda, com detalhes e fotos',
      active: false
    },
    {
      text:'Controle de vagas de estacionamento',
      active: false
    },
    {
      text:'Administradores',
      active: true
    },
    {
      text:'Todas as funções de colaboradores',
      active: false
    },
    {
      text:'Cadastro inteligente de blocos e unidades',
      active: false
    },
    {
      text:'Cadastro de moradores e seus veículos',
      active: false
    },
    {
      text:'Cadastro de moradores',
      active: false
    },
    {
      text:'Cadastro de colaboradores',
      active: false
    },
    {
      text:'Listagem de colaboradores',
      active: false
    },
    {
      text:'Listagem de ocorrências de pernoite',
      active: false
    },
    {
      text:'Listagem de ocorrências de ronda',
      active: false
    },
    {
      text:'Resposta textual para ocorrências de pernoite e ronda',
      active: false
    },
  ]

  return (
    <Fragment>
      <HeaderLanding />
      <Nav />
      <section className='p-4 bg-light roboto'>
        <h3 className='h3 mb-4'>Lista de serviços oferecidos</h3>
        <ListGroup>
        {
          services.map((el, ind)=>(
            <ListGroupItem key={ind} active={el.active} tag="button" action><span style={{fontWeight: el.active ? 'bold' : '300'}}>{!el.active && '\u00A0 \u00A0'}{el.text}</span></ListGroupItem>
          ))
        }
        </ListGroup>
      </section>
      <Landscape />
      <Footer />
    </Fragment>
  );
};

export default Services;