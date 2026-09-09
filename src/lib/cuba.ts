export {
  COUNTRIES,
  COUNTRY_NAMES,
  COUNTRIES as PROVINCES,
  citiesOf,
  citiesOf as municipalitiesOf,
  TRANSPORT_KEYS,
} from "./geo";

/** Fallback labels; UI should prefer i18n `t.transport`. */
export const TRANSPORT_LABEL: Record<string, string> = {
  tengo: "I have transport",
  sin: "No transport · they come to me",
  voy: "I will travel",
};
