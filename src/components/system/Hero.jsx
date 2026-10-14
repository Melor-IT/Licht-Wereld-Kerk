'use client';

import { useIntl } from 'react-intl';
import BackgroundImage from './BackgroundImage';

export default function Hero({
  backgroundImage,
  backgroundClassName = '',
  className,
  title,
  titleClassName,
  titleId,
  eyebrow,
  eyebrowClassName = 'hero-eyebrow',
  intro,
  introClassName = 'hero-subtitle',
  reference,
  action
}) {
  const { formatMessage } = useIntl();

  return (
    <section className={className} aria-labelledby={titleId}>
      <BackgroundImage url={backgroundImage} className={backgroundClassName} />
      <div className="page-content">
        {eyebrow && <p className={eyebrowClassName}>{formatMessage(eyebrow)}</p>}
        <h1 className={titleClassName} id={titleId}>
          {formatMessage(title)}
        </h1>
        {intro && <p className={introClassName}>{formatMessage(intro)}</p>}
        {reference && <p className="hero-citation">{formatMessage(reference)}</p>}
        {action && (
          <a className={action.className} href={action.href}>
            {formatMessage(action.message)}
          </a>
        )}
      </div>
    </section>
  );
}
