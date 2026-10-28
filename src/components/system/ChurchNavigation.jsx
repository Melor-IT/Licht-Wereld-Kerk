'use client';

import Link from 'next/link';
import { useIntl } from 'react-intl';
import { churchPages } from '../../data/about-sections';
import { pathFor } from '../../lib/site';

export default function ChurchNavigation({ locale, currentRoute }) {
  const { formatMessage } = useIntl();

  return (
    <nav className="church-navigation" aria-label={formatMessage({ id: 'churchNavigationLabel' })}>
      <div className="page-content">
        <ul role="list">
          {churchPages.map(({ slug, title }) => (
            <li key={slug}>
              <Link
                href={pathFor(locale, slug)}
                aria-current={slug === currentRoute ? 'page' : undefined}
              >
                {formatMessage(title)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
