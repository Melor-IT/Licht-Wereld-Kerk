'use client';

import { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import Header from '../components/Header';
import Footer from '../components/Footer';
import faMessages from '../i18n/fa';
import nlMessages from '../i18n/nl';
import enMessages from '../i18n/en';
import '../styles/main.scss';

const messages = {
  fa: faMessages,
  nl: nlMessages,
  en: enMessages,
};

const supportedLocales = new Set(Object.keys(messages));

export default function RootLayout({ children }) {
  const [locale, setLocale] = useState('nl');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (supportedLocales.has(savedLocale)) setLocale(savedLocale);
  }, []);

  const changeLocale = (newLocale) => {
    if (!supportedLocales.has(newLocale)) return;
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <html lang={locale}>
      <body className={locale === 'fa' ? 'rtl app' : 'ltr app'} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
        <IntlProvider locale={locale} messages={messages[locale]}>
          <Header locale={locale} setLocale={changeLocale} />
          <main>{children}</main>
          <Footer locale={locale} />
        </IntlProvider>
      </body>
    </html>
  );
}
