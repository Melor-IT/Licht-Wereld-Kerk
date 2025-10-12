"use client";

import { useIntl } from "react-intl";
import BackgroundImage from "../../components/BackgroundImage";

export default function AboutUsPage() {
  const { formatMessage } = useIntl();

  return (
    <div className="page about-us">
      <section>
        <BackgroundImage
          url="/images/about-us-banner.jpg"
          className="aboutus"
        />
           <div className="page-content">
          <h1>
            {formatMessage({ id: "aboutUs", defaultMessage: "About Us" })}
          </h1>
       
        </div>
      </section>
      <section className="our-team">
        <div className="page-content">
          <div className="circle">
            <h3>
              {formatMessage({
                id: "KazemFariba",
                defaultMessage: "Kazem & Fariba",
              })}
            </h3>

            <p>
              {formatMessage({
                id: "KazemFaribaText",
                defaultMessage: "Kazem Fariba Text",
              })}
            </p>
          </div>
          <div className="image-big">
            <img src="/images/kazem.jpg" alt="kazem" />
          </div>
        </div>
      </section>
    </div>
  );
}
