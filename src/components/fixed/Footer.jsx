'use client';

import { useIntl } from 'react-intl';
import Link from 'next/link';
import { FaPhone, FaEnvelope, FaYoutube, FaInstagram } from 'react-icons/fa';
import DonationButton from '../system/DonationButton';
import { donation } from '../../data/donation';
import { contactEmail } from '../../data/contact';

const Footer = ({ locale }) => {
  const { formatMessage } = useIntl();

  return (
    <footer className={`footer ${locale === 'fa' ? 'rtl' : 'ltr'}`}>
      <div className="page-content">
        {/* Footer Message */}
        <div className="content-row message">
          <p className="footer-quote">
            {formatMessage({
              id: 'footerText',
              defaultMessage: 'God is enthroned on the praises of his people.'
            })}
          </p>
        </div>

        {/* Footer Info */}
        <div className="content-row">
          {/* Contact Section */}
          <div className="dark-glass" id="contact" tabIndex={-1}>
            <h2 className="footer-heading">
              <Link href={`/${locale}/contact`}>
                {formatMessage({ id: 'contactTitle', defaultMessage: 'Contact' })}
              </Link>
            </h2>
            <div className="contact">
              <a href="tel:068371262" aria-label={formatMessage({ id: 'phone' })}>
                <FaPhone />
              </a>
              <a href={`mailto:${contactEmail}`} aria-label={formatMessage({ id: 'email' })}>
                <FaEnvelope />
              </a>
            </div>
            <h2 className="footer-heading">
              {formatMessage({
                id: 'socialMedia',
                defaultMessage: 'Social Media'
              })}
            </h2>
            <div className="contact">
              <a
                href="https://www.youtube.com/@LichtWereldKerk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
              <a
                href="https://www.instagram.com/noorejahan_farsi_church"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
            <div>
              <h2 className="footer-heading">IBAN</h2>
              <p lang="nl">{donation.organization}</p>
              <p className="footer-identifier" dir="ltr">
                {donation.iban}
              </p>
            </div>
            <DonationButton />
          </div>

          {/* Address Section */}
          <div className="dark-glass">
            <h2 className="footer-heading">
              {formatMessage({
                id: 'visitingAddress',
                defaultMessage: 'Visiting Address'
              })}
            </h2>
            <p lang="nl" dir="ltr">
              Hildo Kropstraat 8, 1328 BC Almere, Nederland
            </p>

            <h2 className="footer-heading">
              {formatMessage({
                id: 'CorrespondenceAddress',
                defaultMessage: 'Correspondence Address'
              })}
            </h2>
            <p lang="nl" dir="ltr">
              Hildo Kropstraat 8, 1328 BC Almere
            </p>

            <h2 className="footer-heading">
              {formatMessage({ id: 'kvk', defaultMessage: 'KVK' })}
            </h2>
            <p className="footer-identifier" dir="ltr">
              {donation.kvk}
            </p>

            <h2 className="footer-heading">
              {formatMessage({ id: 'RSIN', defaultMessage: 'RSIN' })}
            </h2>
            <p className="footer-identifier" dir="ltr">
              {donation.rsin}
            </p>
          </div>
        </div>
        <div className="footer-credit" lang="nl">
          © {new Date().getFullYear()} Kerk Licht van de Wereld ·{' '}
          <a href="https://mel-or.com/" target="_blank" rel="noopener noreferrer">
            <strong>Made by Melor</strong>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
