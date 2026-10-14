'use client';

import Image from 'next/image';
import { useIntl } from 'react-intl';

export default function TeamIntro({ title, description, image, imageAlt }) {
  const { formatMessage } = useIntl();

  return (
    <section className="our-team team-intro">
      <div className="page-content">
        <div className="circle">
          <h2>{formatMessage(title)}</h2>
          <p>{formatMessage(description)}</p>
        </div>
        <div className="image-big">
          <Image src={image} alt={imageAlt} width={800} height={800} />
        </div>
      </div>
    </section>
  );
}
