'use client';

import { useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import Header from './fixed/Header';
import Footer from './fixed/Footer';
import DonationProvider from './system/DonationDialog';

export default function SiteShell({ locale, messages, children }) {
  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  return (
    <IntlProvider key={locale} locale={locale} messages={messages}>
      <div className={`app ${direction}`} dir={direction}>
        <DonationProvider>
          <Header locale={locale} />
          <main id="main-content">{children}</main>
          <Footer locale={locale} />
        </DonationProvider>
      </div>
    </IntlProvider>
  );
}
