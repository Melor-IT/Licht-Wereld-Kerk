'use client';

import { useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import Header from './Header';
import Footer from './Footer';
import '../components-CSS/SiteShell.css';

export default function SiteShell({ locale, messages, children }) {
  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  return (
    <IntlProvider key={locale} locale={locale} messages={messages}>
      <div className={`app ${direction}`} dir={direction}>
        <Header locale={locale} />
        <main id="main-content">{children}</main>
        <Footer locale={locale} />
      </div>
    </IntlProvider>
  );
}
