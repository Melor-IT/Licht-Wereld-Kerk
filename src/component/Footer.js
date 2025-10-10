import { useIntl } from 'react-intl';

const Footer = () => {
  const { formatMessage } = useIntl();

  const footerStyle = {
    backgroundImage: `url(/images/footerimage.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white'
  };

  return (
    <footer className="footer" style={footerStyle}>
      <div className="page-content">
        <div className="content-row message">
          <h3>{formatMessage({ id: 'footerText' })}</h3>
        </div>

        <div className="botoje-gold"></div>

        <div className="content-row">
          <div className="dark-glass">
            <h4>{formatMessage({ id: 'visitAddressTitle' })}</h4>
            <p>{formatMessage({ id: 'visitAddress' })}</p>

            <h4>{formatMessage({ id: 'mailAddressTitle' })}</h4>
            <p>{formatMessage({ id: 'mailAddress' })}</p>

            <h4>{formatMessage({ id: 'emailTitle' })}</h4>
            <p>
              <a href="mailto:lichtwereldkerk2022@gmail.com">
                {formatMessage({ id: 'email' })}
              </a>
            </p>

            <h4>{formatMessage({ id: 'kvkTitle' })}</h4>
            <p>{formatMessage({ id: 'kvk' })}</p>

            <h4>{formatMessage({ id: 'servicesTitle' })}</h4>
            <p>{formatMessage({ id: 'services' })}</p>

            <h4>{formatMessage({ id: 'contactTitle' })}</h4>
            <div className="footer-icons">
              <a href="tel:068371262">
                <span className="icon-phone"></span>
              </a>
              <a href="mailto:lichtwereldkerk2022@gmail.com">
                <span className="icon-envelop"></span>
              </a>
              <a
                href="https://www.youtube.com/@LichtWereldKerk"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="icon-youtube"></span>
              </a>
              <a
                href="https://www.instagram.com/noorejahan_farsi_church?igsh=MTA1djZzdnByeHJldQ=="
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="icon-instagram"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
