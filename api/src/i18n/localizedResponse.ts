import { locales } from "./locale.js";

export type Locale = (typeof locales)[number];
export type LocalizedMessage = Record<Locale, string>;

export const localizedMessage = (
  messages: LocalizedMessage
): LocalizedMessage => messages;
