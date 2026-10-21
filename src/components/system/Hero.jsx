'use client';

import { useIntl } from 'react-intl';
import BackgroundImage from './BackgroundImage';

export default function Hero({
  backgroundImage,
  backgroundClassName = '',
  className = '',
  title,
  titleId,
  eyebrow,
  intro,
  reference,
  action
}) {
  const { formatMessage } = useIntl();

  return (
    <section className={`hero ${className}`.trim()} aria-labelledby={titleId}>
      <BackgroundImage url={backgroundImage} className={backgroundClassName} preload />
      <div className="page-content">
        {eyebrow && <p className="hero-eyebrow">{formatMessage(eyebrow)}</p>}
        <h1 className="hero-title" id={titleId}>
          {formatMessage(title)}
        </h1>
        {intro && <p className="hero-subtitle">{formatMessage(intro)}</p>}
        {reference && <p className="hero-citation">{formatMessage(reference)}</p>}
        {action && (
          <a className="hero-action" href={action.href}>
            {formatMessage(action.message)}
          </a>
        )}
      </div>
    </section>
  );
}
