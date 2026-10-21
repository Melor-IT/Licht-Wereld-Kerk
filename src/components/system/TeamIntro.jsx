'use client';

import Image from 'next/image';
import { useId } from 'react';
import { useIntl } from 'react-intl';

export default function TeamIntro({
  title,
  role,
  description,
  image,
  imageAlt,
  imageWidth = 800,
  imageHeight = 800,
  variant = 'secondary',
  reverse = false
}) {
  const { formatMessage } = useIntl();
  const titleId = useId();
  const paragraphs = Array.isArray(description) ? description : [description];

  return (
    <section
      className={`our-team team-intro ${variant}${reverse ? ' team-intro-reversed' : ''}`}
      aria-labelledby={titleId}
    >
      <div className="page-content">
        <div className="team-intro-photo">
          <Image
            src={image}
            alt={typeof imageAlt === 'string' ? imageAlt : formatMessage(imageAlt)}
            width={imageWidth}
            height={imageHeight}
            sizes="(max-width: 528px) calc(100vw - 3rem), (max-width: 1100px) 480px, 420px"
          />
        </div>
        <div className="team-intro-content text-block">
          <h2 id={titleId}>{formatMessage(title)}</h2>
          {role && <p className="team-intro-role">{formatMessage(role)}</p>}
          {paragraphs.map((paragraph) => (
            <p key={paragraph.id}>{formatMessage(paragraph)}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
