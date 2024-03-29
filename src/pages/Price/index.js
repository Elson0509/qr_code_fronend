import React, { Fragment, useState } from 'react'
import HeaderLanding from '../../layout/Landing/HeaderLanding'
import Footer from '../../layout/Footer'
import Nav from '../../layout/Landing/Nav'
import Landscape from '../../layout/Landing/Landscape'
import { CardGroup, Card, CardBody, CardTitle, Jumbotron, CardHeader, CardSubtitle } from 'reactstrap'
import ModalEmail from '../../components/Modals/ModalEmail'
import CheckList from './CheckList'

const Price = () => {
  const [modalEmail, setModalEmail] = useState(false)

  return (
    <Fragment>
      <HeaderLanding />
      <Nav />
      <section className='p-4 bg-light'>
        <div className="px-3 pt-md-3 pb-md-4 mx-auto text-center">
          {/* <h1 className="display-4">Investimento</h1> */}
          <p className="lead">Contratação de solução moderna para controle de acesso de condomínios com login individual de administradores, colaboradores e residentes.</p>
        </div>
        <div className='row text-center'>
          <CardGroup>
            <Card>
              {/* <CardHeader>
                <h4 className="my-0 font-weight-normal">Plano Ouro</h4>
              </CardHeader> */}
              <CardBody>
                <CardTitle tag="h1">
                  {/* R$ 199,90<small className="text-muted">/ mês</small> */}
                </CardTitle>
                <CardSubtitle>
                  <CheckList text='Sem limites de unidades incluído' />
                  {/* <button type="button" onClick={() => setModalEmail(true)} className="btn btn-lg btn-block btn-primary">Contato</button> */}
                </CardSubtitle>
              </CardBody>
            </Card>
          </CardGroup>
        </div>
        <div className='row text-center my-4'>
          <Card
            body
            inverse
            className='bg-dark justify-content-center'>
            <CardTitle tag="h2">
              Entre em contato e surpreenda-se com o preço acessível para você e seu condomínio!
            </CardTitle>
            <button type="button" onClick={() => setModalEmail(true)} className="btn btn-lg btn-block btn-primary my-2 p-2">Contato</button>
          </Card>
        </div>
        <div className='row text-center my-4'>
          <Jumbotron>
            <h1 className="display-3">Contrate hoje e inclua</h1>
            <p className="lead">Adquirindo o serviço hoje, os planos bronze, prata e ouro receberão também o módulo de cadastro e geração de QR Code para visitantes, terceirizados e seus veículos.</p>
            <hr className="my-2" />
            <p>Atenção! Essa promoção é por tempo limitado</p>
          </Jumbotron>
        </div>
        <ModalEmail modalEmail={modalEmail} setModalEmail={setModalEmail} />
      </section>
      <Landscape />
      <Footer />
    </Fragment>
  )
}

export default Price