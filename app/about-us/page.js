'use client';

import { useIntl } from 'react-intl';
import BackgroundImage from '../../components/BackgroundImage';

export default function AboutUsPage() {
  const { formatMessage } = useIntl();

  return (
    <div className="page about-us">
      {/* بخش بالایی با بنر */}
      <section>
        <BackgroundImage url="/images/join-us-banner.png" className="aboutus" />
        <div className="page-content">
          <h1>{formatMessage({ id: 'aboutUs', defaultMessage: 'About Us' })}</h1>
          <h3 className="page-intro">
            {formatMessage({ id: 'aboutUsText', defaultMessage: 'The Spirit of the Lord GOD is upon me ...' })}
          </h3>
          <h3>
            {formatMessage({ id: 'aboutUsTextOnder', defaultMessage: '- Isaiah 61:1-3' })}
          </h3>
        </div>
      </section>

      {/* بخش تیم رهبری */}
      <section className="primary">
        <div className="page-content">
          <div className="text-block">
            <h2>{formatMessage({ id: 'leader', defaultMessage: 'Leadership Team' })}</h2>
            <p>{formatMessage({ id: 'leaderText', defaultMessage: 'Leadership team of Reda-ye Setayesh...' })}</p>
          </div>
          <div className="team">
            {/* اعضای تیم را اینجا map کن */}
          </div>
        </div>
      </section>

      {/* بخش کمیسیون نظارت */}
      <section className="secondary">
        <div className="page-content">
          <div className="text-block">
            <h2>{formatMessage({ id: 'supervisoryCommission', defaultMessage: 'Supervisory Commission' })}</h2>
            <p>{formatMessage({ id: 'supervisoryCommissionText', defaultMessage: 'The Supervisory Commission of Reda-ye Setayesh...' })}</p>
          </div>
          <div className="team">
            {/* اعضای کمیسیون */}
          </div>
        </div>
      </section>
    </div>
  );
}
