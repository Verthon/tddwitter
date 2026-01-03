import { createElement, type ReactElement } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import enComposer from '../composer/i18n/en.json';
import enCore from '../core/i18n/en.json';
import enTimeline from '../timeline/i18n/en.json';
import enEngagement from '../engagement/i18n/en.json';

import { useLocaleContext } from './LocaleProvider';
import type { MessageValues } from './types';

const allMessages = {
  ...enCore,
  ...enComposer,
  ...enTimeline,
  ...enEngagement,
} as const;

export type MessageKey = keyof typeof allMessages;
type MessageContent<K extends MessageKey> = (typeof allMessages)[K];

// Helper type to check if values are required
type ValuesRequired<K extends MessageKey> = MessageValues<
  MessageContent<K>
> extends Record<string, never>
  ? false
  : true;

// Overloaded function signatures for better DX
interface TranslateFn {
  <K extends MessageKey>(
    key: ValuesRequired<K> extends true ? never : K,
  ): string;

  <K extends MessageKey>(
    key: K,
    values: MessageValues<MessageContent<K>>,
  ): string;
}

interface FormatMessageFn {
  <K extends MessageKey>(
    key: ValuesRequired<K> extends true ? never : K,
  ): ReactElement;

  <K extends MessageKey>(
    key: K,
    values: MessageValues<MessageContent<K>>,
  ): ReactElement;
}

interface UseTranslationReturn {
  locale: ReturnType<typeof useLocaleContext>['locale'];
  setLocale: ReturnType<typeof useLocaleContext>['setLocale'];
  t: TranslateFn;
  formatMessage: FormatMessageFn;
}

export const useTranslation = (): UseTranslationReturn => {
  const { locale, setLocale } = useLocaleContext();
  const intl = useIntl();

  const t: TranslateFn = (key: any, values?: any) => {
    return intl.formatMessage({ id: key }, values);
  };

  const formatMessage: FormatMessageFn = (key: any, values?: any) => {
    return createElement(FormattedMessage, { id: key, values });
  };

  return { locale, setLocale, t, formatMessage };
};
