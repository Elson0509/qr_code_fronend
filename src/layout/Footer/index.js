import React, { useState, Fragment } from 'react'
import classes from './Footer.module.css'
import Icon from '../../components/Icon'
import { useAuth } from '../../contexts/auth'
import PrivacyModal from '../../components/Modals/PrivacyModal'
import TermsModal from '../../components/Modals/TermsModal'

import {
  faFacebook,
  faLinkedin,
  faInstagram,
  faYoutube
} from '@fortawesome/free-brands-svg-icons'
import gplayImg from '../../Images/gplay.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
  const { user } = useAuth()
  const [modalTerms, setModalTerms] = useState(false)
  const [modalPrivacy, setModalPrivacy] = useState(false)

  return (
    <Fragment>
      <footer className={`${classes.Footer} roboto`}>
        <div className={classes.FooterSpace}>
          {
            user ?
            null
            :
            <div className={classes.FooterColumns}>
              <div className={classes.DivChild}>
                <h5 className={classes.TitleCompany}>
                  <Icon icon='shield-alt' color='white' size='2x' />
                  <span style={{ marginLeft: '5px' }}>QR Condo</span>
                </h5>
                <div className={classes.SubDiv}>
                  <h6 className={classes.SubDivTitle}>Contato</h6>
                  <ul>
                    <li>Tel: (21) 97509-3237 (Pedro Tarquínio)</li>
                    <li>Tel: (21) 99776-4893 (Wander Pedreira)</li>
                    <li>Email: <a href='mailto:comercial@qrcondo.com.br'>comercial@qrcondo.com.br</a></li>
                  </ul>
                </div>
                <div className={classes.SocialmediaDiv}>
                  <ul>
                    <li>
                      <a href="https://www.facebook.com/profile.php?id=100053685274776" target="_blank" rel="noopener noreferrer" aria-label="facebook">
                        <FontAwesomeIcon icon={faFacebook} size="2x" color='#3b5998 ' />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com/tarquinioepedreira/" target="_blank" rel="noopener noreferrer" aria-label="instagram">
                        <FontAwesomeIcon icon={faInstagram} size="2x" color='#DD2A7B' />
                      </a>
                    </li>
                    {/* <li>
                      <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="youtube">
                        <FontAwesomeIcon icon={faYoutube} size="2x" color='#c4302b' />
                      </a>
                    </li> */}
                    <li>
                      <a href="https://www.linkedin.com/company/tarqu%C3%ADnio-pedreira-consultoria-e-treinamento-em-seguran%C3%A7a/" target="_blank" rel="noopener noreferrer" aria-label="linkedin">
                        <FontAwesomeIcon icon={faLinkedin} size="2x" color='#3b5998' />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={classes.DivChild}>
                <h6 className={`${classes.SubDivTitle}`}>Fornecedor</h6>
                <a href='https://tarquinioepedreira.com.br/' target="_blank" rel="noopener noreferrer" >
                  <img src='/imgs/rsz_logo-tp.png' alt='Logo Tarquínio e Pedreira' className={classes.ImgTP} />
                </a>
              </div>
              <div className={`${classes.DivChild} ${classes.GPlayDiv}`}>
                <a href="https://play.google.com/store/apps/details?id=com.qrcondo.qrcondo" target="_blank" rel="noopener noreferrer" aria-label="google play store">
                  <img src={gplayImg} alt='google play app qrcondo' width='100%' height='auto' />
                </a>
              </div>
            </div>
          }
          <div className={classes.FooterPrivacy}>
            <p>Copyright 2022, Todos os direitos reservados</p>
            <ul>
              <li><button className={classes.ButtonLink} onClick={() => setModalTerms(true)}>Termos e condições</button></li>
              <li><button className={classes.ButtonLink} onClick={() => setModalPrivacy(true)}>Política de privacidade</button></li>
            </ul>
          </div>
        </div>
      </footer>
      <PrivacyModal modal={modalPrivacy} toggle={() => setModalPrivacy(false)} />
      <TermsModal modal={modalTerms} toggle={() => setModalTerms(false)} />
    </Fragment>
  );
};

export default Footer;