import { useIntl } from 'react-intl';
import type enComposer from '../composer/i18n/en.json';
import type enCore from '../core/i18n/en.json';
import type enEngagement from '../engagement/i18n/en.json';
import type enTimeline from '../timeline/i18n/en.json';
import { useLocaleContext } from './LocaleProvider';

export type CoreMessageKey = keyof typeof enCore;
export type ComposerMessageKey = keyof typeof enComposer;
export type EngagementMessageKey = keyof typeof enEngagement;
export type TimelineMessageKey = keyof typeof enTimeline;

export type MessageKey =
  | CoreMessageKey
  | ComposerMessageKey
  | EngagementMessageKey
  | TimelineMessageKey;

type TranslateFn = <K extends MessageKey>(
  key: K,
  values?: Record<string, string>,
) => string;

interface UseLocaleReturn {
  locale: ReturnType<typeof useLocaleContext>['locale'];
  setLocale: ReturnType<typeof useLocaleContext>['setLocale'];
  t: TranslateFn;
}

export const useLocale = (): UseLocaleReturn => {
  const { locale, setLocale } = useLocaleContext();
  const intl = useIntl();

  const t: TranslateFn = (key, values) =>
    intl.formatMessage({ id: key }, values);

  return { locale, setLocale, t };
};
