"use client";

import { useIntl } from "react-intl";
import BackgroundImage from "../../components/BackgroundImage";

export default function OurVisionPage() {
  const { formatMessage } = useIntl();

  return (
    <div className="page our-vision">
      {/* Header Section */}
      <section>
        <BackgroundImage
          url="/images/ourvision-banner.jpg"
          className="ourVisionHeader"
        />
        <div className="page-content">
          <h1>
            {formatMessage({
              id: "ourVisionTitle",
              defaultMessage: "Our Vision",
            })}
          </h1>
           <h2>
              {formatMessage({
                id: "ourVisionText",
                defaultMessage:
                  "",
              })}
            </h2>
             <h4>
              {formatMessage({
                id: "ourVisionOnder",
                defaultMessage:
                  '(Johannes 1:5)',
              })}
            </h4>
        </div>
      </section>

      {/* Section 1: Unity in Prayer and True Worship */}
      <section className="primary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: "unityPrayerWorshipTitle",
                defaultMessage: "Unity in Prayer and True Worship",
              })}
            </h2>
            <p>
              {formatMessage({
                id: "unityPrayerWorshipIntro",
                defaultMessage:
                  "Christian faith is not merely an individual faith...",
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: God enthroned through praise */}
      <section className="secondary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: "godThroneTitle",
                defaultMessage:
                  "God enthroned through the praise of His people",
              })}
            </h2>
            <p>
              {formatMessage({
                id: "godThroneText",
                defaultMessage: 'Psalm 22:3: "Yet you are holy..."',
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: God’s throne among His people */}
      <section className="primary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: "godsThroneAmongPeopleTitle",
                defaultMessage: "God’s throne among His people",
              })}
            </h2>
            <p>
              {formatMessage({
                id: "godsThroneAmongPeopleText",
                defaultMessage: 'Jeremiah 49:38: "I will set up my throne..."',
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: We are God’s temple */}
      <section className="secondary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: "godsTempleTitle",
                defaultMessage: "We are God’s temple",
              })}
            </h2>
            <p>
              {formatMessage({
                id: "godsTempleText",
                defaultMessage: '1 Corinthians 3:16: "Do you not know..."',
              })}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
