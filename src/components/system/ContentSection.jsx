'use client';

import { useIntl } from 'react-intl';
import { Fragment } from 'react';
import Link from 'next/link';

export default function ContentSection({
  title,
  description,
  descriptionClassName,
  items = [],
  quote,
  after = [],
  subsections = [],
  action,
  ordered = false,
  variant = 'primary',
  textBlock = true
}) {
  const { formatMessage, locale } = useIntl();
  const paragraphs = description ? (Array.isArray(description) ? description : [description]) : [];
  const List = ordered ? 'ol' : 'ul';
  const headingId = title ? `${title.id}-heading` : undefined;
  const content = (
    <>
      {title && <h2 id={headingId}>{formatMessage(title)}</h2>}
      {paragraphs.map((paragraph) => (
        <p key={paragraph.id} className={descriptionClassName}>
          {formatMessage(paragraph)}
        </p>
      ))}
      {quote && (
        <blockquote>
          <p>{formatMessage(quote.text)}</p>
          {quote.reference && <cite>{formatMessage(quote.reference)}</cite>}
        </blockquote>
      )}
      {items.length > 0 && (
        <List>
          {items.map((item) => (
            <li key={Array.isArray(item) ? item[0].id : item.title?.id || item.id}>
              {Array.isArray(item) ? (
                item.map((message, index) => (
                  <Fragment key={message.id}>
                    {index > 0 && ': '}
                    {formatMessage(message)}
                  </Fragment>
                ))
              ) : item.title ? (
                <>
                  <strong>{formatMessage(item.title)}:</strong> {formatMessage(item.description)}
                </>
              ) : (
                formatMessage(item)
              )}
            </li>
          ))}
        </List>
      )}
      {subsections.map((subsection) => (
        <div className="content-subsection" key={subsection.title.id}>
          <h3>{formatMessage(subsection.title)}</h3>
          {subsection.description.map((paragraph) => (
            <p key={paragraph.id}>{formatMessage(paragraph)}</p>
          ))}
        </div>
      ))}
      {after.map((paragraph) => (
        <p key={paragraph.id}>{formatMessage(paragraph)}</p>
      ))}
      {action && (
        <Link className="button" href={action.slug ? `/${locale}/${action.slug}` : action.href}>
          {formatMessage(action.message)}
        </Link>
      )}
    </>
  );

  return (
    <section className={variant} aria-labelledby={headingId}>
      <div className="page-content">
        {textBlock ? <div className="text-block">{content}</div> : content}
      </div>
    </section>
  );
}
