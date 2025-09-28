import { IntlProvider } from 'react-intl';
import React, { ReactNode } from 'react';

import { LocaleProvider, useLocale } from './LocaleProvider';

import enCore from './messages/core/en.json';
import enComposer from './messages/composer/en.json';
import enTimeline from './messages/timeline/en.json';

const messagesByLocale = {
  en: { ...enCore, ...enComposer, ...enTimeline },
} as const;

export const I18nProvider = ({ children }: { children: ReactNode }) => (
  <LocaleProvider>
    <InnerIntlProvider>{children}</InnerIntlProvider>
  </LocaleProvider>
);

const InnerIntlProvider = ({ children }: { children: ReactNode }) => {
  const { locale } = useLocale();
  const messages = messagesByLocale[locale] ?? messagesByLocale.en;

  return (
    <IntlProvider locale={locale} defaultLocale="en" messages={messages}>
      {children}
    </IntlProvider>
  );
};
