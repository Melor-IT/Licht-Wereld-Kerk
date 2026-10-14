'use client';

import Link from 'next/link';
import { useIntl } from 'react-intl';

export default function AboutSection({ title, description, button, href }) {
  const { formatMessage } = useIntl();

  return (
    <section className="primary about-us">
      <div className="page-content">
        <div className="text-block">
          <h2>{formatMessage(title)}</h2>
        </div>
        <div className="text-block">
          <p>{formatMessage(description)}</p>
          <Link className="button" href={href}>
            {formatMessage(button)}
          </Link>
        </div>
      </div>
    </section>
  );
}
