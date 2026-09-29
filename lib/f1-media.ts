/**
 * Maps Ergast/Jolpica nationality demonyms (e.g. "Dutch", "British") to ISO
 * 3166-1 alpha-2 country codes used by flagcdn. Covers every nationality on the
 * current and recent F1 grids plus common constructor nationalities.
 */
const NATIONALITY_TO_CODE: Record<string, string> = {
  British: "gb",
  English: "gb",
  Scottish: "gb",
  Welsh: "gb",
  "Northern Irish": "gb",
  Dutch: "nl",
  German: "de",
  Italian: "it",
  Spanish: "es",
  French: "fr",
  Monegasque: "mc",
  Mexican: "mx",
  Australian: "au",
  Finnish: "fi",
  Canadian: "ca",
  Danish: "dk",
  Thai: "th",
  Japanese: "jp",
  American: "us",
  Austrian: "at",
  "New Zealander": "nz",
  Argentine: "ar",
  Argentinian: "ar",
  Brazilian: "br",
  Belgian: "be",
  Swiss: "ch",
  Swedish: "se",
  Chinese: "cn",
  Russian: "ru",
  Portuguese: "pt",
  Polish: "pl",
  Indian: "in",
  Indonesian: "id",
  Irish: "ie",
  Colombian: "co",
  Venezuelan: "ve",
  "South African": "za",
}

export function nationalityToCode(nationality?: string | null): string | null {
  if (!nationality) return null
  return NATIONALITY_TO_CODE[nationality.trim()] ?? null
}

/** flagcdn PNG at ~40px wide. Returns null when the nationality is unmapped. */
export function flagUrl(nationality?: string | null): string | null {
  const code = nationalityToCode(nationality)
  return code ? `https://flagcdn.com/w40/${code}.png` : null
}

/** Maps circuit/location country names to ISO alpha-2 codes for flag display. */
const COUNTRY_TO_CODE: Record<string, string> = {
  Australia: "au",
  Austria: "at",
  Azerbaijan: "az",
  Bahrain: "bh",
  Belgium: "be",
  Brazil: "br",
  Canada: "ca",
  China: "cn",
  France: "fr",
  Germany: "de",
  Hungary: "hu",
  India: "in",
  Italy: "it",
  Japan: "jp",
  Mexico: "mx",
  Monaco: "mc",
  Netherlands: "nl",
  Portugal: "pt",
  Qatar: "qa",
  "Saudi Arabia": "sa",
  Singapore: "sg",
  Spain: "es",
  "United Arab Emirates": "ae",
  UAE: "ae",
  "United Kingdom": "gb",
  UK: "gb",
  "Great Britain": "gb",
  "United States": "us",
  USA: "us",
  "United States of America": "us",
}

export function countryToCode(country?: string | null): string | null {
  if (!country) return null
  return COUNTRY_TO_CODE[country.trim()] ?? null
}

/** flagcdn PNG for a country name. Returns null when unmapped. */
export function countryFlagUrl(country?: string | null): string | null {
  const code = countryToCode(country)
  return code ? `https://flagcdn.com/w40/${code}.png` : null
}

/**
 * Wikipedia article titles for drivers whose article title differs from the
 * display name (disambiguation suffixes, full legal names, accents). Any driver
 * not listed falls back to their display name, which resolves for most.
 */
const DRIVER_WIKI_OVERRIDES: Record<string, string> = {
  "Kimi Antonelli": "Andrea Kimi Antonelli",
  "Andrea Kimi Antonelli": "Andrea Kimi Antonelli",
  "George Russell": "George Russell (racing driver)",
  "Carlos Sainz": "Carlos Sainz Jr.",
  "Carlos Sainz Jr": "Carlos Sainz Jr.",
  "Nico Hulkenberg": "Nico Hülkenberg",
  "Nico Hülkenberg": "Nico Hülkenberg",
  "Zhou Guanyu": "Zhou Guanyu",
  "Guanyu Zhou": "Zhou Guanyu",
}

/** Wikipedia article title for a driver's lead-image headshot. */
export function driverWikiTitle(name?: string | null): string | null {
  if (!name) return null
  const trimmed = name.trim()
  return DRIVER_WIKI_OVERRIDES[trimmed] ?? trimmed
}

/** Wikipedia article titles for constructors keyed by Ergast/Jolpica id. */
const TEAM_WIKI_BY_ID: Record<string, string> = {
  red_bull: "Red Bull Racing",
  ferrari: "Scuderia Ferrari",
  mercedes: "Mercedes-AMG Petronas F1 Team",
  mclaren: "McLaren",
  aston_martin: "Aston Martin in Formula One",
  alpine: "Alpine F1 Team",
  williams: "Williams Racing",
  rb: "RB (Formula One team)",
  racing_bulls: "Racing Bulls",
  alphatauri: "RB (Formula One team)",
  haas: "Haas F1 Team",
  sauber: "Sauber Motorsport",
  kick_sauber: "Sauber Motorsport",
  audi: "Audi in Formula One",
}

/** Fallback title lookup by normalized constructor name. */
const TEAM_WIKI_BY_NAME: Record<string, string> = {
  "red bull": "Red Bull Racing",
  "red bull racing": "Red Bull Racing",
  ferrari: "Scuderia Ferrari",
  "scuderia ferrari": "Scuderia Ferrari",
  mercedes: "Mercedes-AMG Petronas F1 Team",
  mclaren: "McLaren",
  "aston martin": "Aston Martin in Formula One",
  alpine: "Alpine F1 Team",
  williams: "Williams Racing",
  rb: "RB (Formula One team)",
  "racing bulls": "Racing Bulls",
  "visa cash app rb": "RB (Formula One team)",
  haas: "Haas F1 Team",
  sauber: "Sauber Motorsport",
  "kick sauber": "Sauber Motorsport",
  "stake f1 team": "Sauber Motorsport",
  audi: "Audi in Formula One",
}

/** Wikipedia article title for a constructor's lead-image logo. */
export function teamWikiTitle(team?: { id?: string | null; name?: string | null } | null): string | null {
  if (!team) return null
  if (team.id && TEAM_WIKI_BY_ID[team.id]) return TEAM_WIKI_BY_ID[team.id]
  const name = team.name?.trim()
  if (!name) return null
  const key = name.toLowerCase()
  if (TEAM_WIKI_BY_NAME[key]) return TEAM_WIKI_BY_NAME[key]
  const partial = Object.keys(TEAM_WIKI_BY_NAME).find((k) => key.includes(k))
  return partial ? TEAM_WIKI_BY_NAME[partial] : name
}
