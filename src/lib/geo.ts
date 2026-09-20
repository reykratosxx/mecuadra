/** Country → cities. `province` in the DB now means country; `municipality` means city. */

export const COUNTRIES: Record<string, string[]> = {
  India: ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata", "Jaipur", "Ahmedabad"],
  "United States": ["New York", "San Francisco", "Austin", "Miami", "Chicago", "Seattle", "Los Angeles", "Boston"],
  Spain: ["Madrid", "Barcelona", "Valencia", "Seville", "Bilbao"],
  Mexico: ["Mexico City", "Guadalajara", "Monterrey", "Mérida", "Puebla"],
  Argentina: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"],
  Brazil: ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Brasília"],
  Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
  "United Kingdom": ["London", "Manchester", "Edinburgh", "Bristol"],
  France: ["Paris", "Lyon", "Marseille", "Toulouse"],
  Japan: ["Tokyo", "Osaka", "Kyoto", "Fukuoka"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary"],
  Australia: ["Sydney", "Melbourne", "Brisbane"],
  Colombia: ["Bogotá", "Medellín", "Cali", "Cartagena"],
  Chile: ["Santiago", "Valparaíso", "Concepción"],
  Peru: ["Lima", "Cusco", "Arequipa"],
  Portugal: ["Lisbon", "Porto"],
  Italy: ["Rome", "Milan", "Florence", "Naples"],
  Netherlands: ["Amsterdam", "Rotterdam", "Utrecht"],
  Poland: ["Warsaw", "Kraków", "Gdańsk"],
  "South Africa": ["Cape Town", "Johannesburg", "Durban"],
  Nigeria: ["Lagos", "Abuja", "Port Harcourt"],
  Kenya: ["Nairobi", "Mombasa"],
  Egypt: ["Cairo", "Alexandria"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi"],
  Singapore: ["Singapore"],
  Indonesia: ["Jakarta", "Bali", "Surabaya"],
  Philippines: ["Manila", "Cebu"],
  "South Korea": ["Seoul", "Busan"],
  Cuba: [
    "La Habana",
    "Santiago de Cuba",
    "Camagüey",
    "Holguín",
    "Santa Clara",
    "Guantánamo",
    "Pinar del Río",
    "Matanzas",
  ],
  "El Salvador": ["San Salvador", "Santa Ana"],
  "Costa Rica": ["San José", "Liberia"],
};

export const COUNTRY_NAMES = Object.keys(COUNTRIES);

export const TRANSPORT_KEYS = ["tengo", "sin", "voy"] as const;

/** @deprecated use COUNTRIES — kept so existing imports compile during the fork. */
export const PROVINCES = COUNTRIES;

export function citiesOf(country: string) {
  return COUNTRIES[country] ?? [];
}

export function municipalitiesOf(country: string) {
  return citiesOf(country);
}

export function isKnownCountry(name: string) {
  return Boolean(COUNTRIES[name]);
}
