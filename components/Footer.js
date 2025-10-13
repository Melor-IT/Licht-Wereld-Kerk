"use client";

import { useIntl } from "react-intl";
import { FaPhone, FaEnvelope, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = ({ locale }) => {
  const { formatMessage } = useIntl();

  const footerStyle = {
    backgroundImage: `url(/images/footerimage.png)`,
  };

  return (
    <footer
      className={`footer ${locale === "fa" ? "rtl" : "ltr"}`}
      style={footerStyle}
    >
      <div className="page-content">
        {/* Footer Message */}
        <div className="content-row message">
          <h3>
            {formatMessage({
              id: "footerText",
              defaultMessage:
                "God is enthroned on the praises of His people...",
            })}
          </h3>
        </div>

        {/* Footer Info */}
        <div className="content-row">
          {/* Contact Section */}
          <div className="dark-glass">
            <h4>
              {formatMessage({ id: "contactTitle", defaultMessage: "Contact" })}
            </h4>
            <div className="contact">
              <a href="tel:068371262" aria-label="Phone">
                <FaPhone />
              </a>
              <a href="mailto:lichtwereldkerk2022@gmail.com" aria-label="Email">
                <FaEnvelope />
              </a>
            </div>
            <h4>
              {formatMessage({
                id: "socialMedia",
                defaultMessage: "Social Media",
              })}
            </h4>
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
          </div>

          {/* Address Section */}
          <div className="dark-glass">
            <h4>
              {formatMessage({
                id: "visitingAddress",
                defaultMessage: "Visiting Address",
              })}
            </h4>
            <p>Parkwijklaan 5, 1326 AX Almere, Nederland</p>

            <h4>
              {formatMessage({
                id: "CorrespondenceAddress",
                defaultMessage: "Correspondence Address",
              })}
            </h4>
            <p>Madridweg 28, 1334 DR Almere, Nederland</p>

            <h4>{formatMessage({ id: "kvk", defaultMessage: "KVK" })}</h4>
            <p>92274404</p>

            <h4>{formatMessage({ id: "RSIN", defaultMessage: "RSIN" })}</h4>
            <p>865970245</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
