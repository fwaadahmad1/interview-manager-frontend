import { getRequestConfig } from "next-intl/server";
import "../translations/en.json";

export const SUPPORTED_LOCALES = ["en"];

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = SUPPORTED_LOCALES[0];

  return {
    locale,
    messages: (await import(`../translations/${locale}.json`)).default,
  };
});
