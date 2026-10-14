'use client';

import { useIntl } from 'react-intl';
import { Fragment } from 'react';

export default function ContentSection({
  title,
  description,
  descriptionClassName,
  items = [],
  variant = 'primary',
  textBlock = true
}) {
  const { formatMessage } = useIntl();
  const content = (
    <>
      {title && <h2>{formatMessage(title)}</h2>}
      {description && <p className={descriptionClassName}>{formatMessage(description)}</p>}
      {items.length > 0 && (
        <ul>
          {items.map((item) => (
            <li key={Array.isArray(item) ? item[0].id : item.id}>
              {Array.isArray(item)
                ? item.map((message, index) => (
                    <Fragment key={message.id}>
                      {index > 0 && ': '}
                      {formatMessage(message)}
                    </Fragment>
                  ))
                : formatMessage(item)}
            </li>
          ))}
        </ul>
      )}
    </>
  );

  return (
    <section className={variant}>
      <div className="page-content">
        {textBlock ? <div className="text-block">{content}</div> : content}
      </div>
    </section>
  );
}
