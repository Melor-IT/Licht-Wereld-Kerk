'use client';

import Image from 'next/image';
import { useIntl } from 'react-intl';

export default function ServicesSection({ description, items }) {
  const { formatMessage } = useIntl();

  return (
    <section className="secondary services-section">
      <div className="page-content">
        <header className="missionus">
          <p className="mission-statement">{formatMessage(description)}</p>
        </header>
        <div className="services">
          {items.map((item) => (
            <div key={item.title.id}>
              <h3>{formatMessage(item.title)}</h3>
              <p>{formatMessage(item.description)}</p>
              <div className={['image-circle', item.imageClassName].filter(Boolean).join(' ')}>
                <Image
                  src={item.image}
                  alt={formatMessage(item.imageAlt)}
                  width={600}
                  height={600}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
