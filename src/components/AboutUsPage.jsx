"use client";

import { useIntl } from "react-intl";
import BackgroundImage from "./BackgroundImage";
import Image from "next/image";

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
          <h2>
            {formatMessage({
              id: "aboutUsTitle",
              defaultMessage:
                "Laat zo uw licht voor de mensen schijnen, zodat zij uw goede daden zien en uw Vader die in de hemel",
            })}
          </h2>
          <h4>
            {" "}
            {formatMessage({
              id: "aboutUsondertext",
              defaultMessage: "Matteüs 5:16",
            })}
          </h4>
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
            <Image src="/images/kazem.jpg" alt="Kazem and Fariba" width={800} height={800} />
          </div>
        </div>
      </section>
    </div>
  );
}
