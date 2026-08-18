export const PROVINCES: Record<string, string[]> = {
  "La Habana": [
    "Plaza de la Revolución",
    "Centro Habana",
    "Habana Vieja",
    "Cerro",
    "Diez de Octubre",
    "Playa",
    "Marianao",
    "La Lisa",
    "Boyeros",
    "Arroyo Naranjo",
    "San Miguel del Padrón",
    "Cotorro",
    "Guanabacoa",
    "Habana del Este",
    "Regla",
  ],
  "Artemisa": [
    "Artemisa",
    "Bauta",
    "Caimito",
    "Guanajay",
    "Güira de Miranda",
    "Mariel",
    "San Antonio de los Baños",
  ],
  "Mayabeque": [
    "San José de las Lajas",
    "Bejucal",
    "Güines",
    "Jaruco",
    "Santa Cruz del Norte",
  ],
  "Matanzas": ["Matanzas", "Cárdenas", "Varadero", "Colón", "Jagüey Grande"],
  "Villa Clara": ["Santa Clara", "Caibarién", "Remedios", "Sagua la Grande"],
  "Cienfuegos": ["Cienfuegos", "Cruces", "Palmira"],
  "Sancti Spíritus": ["Sancti Spíritus", "Trinidad", "Cabaiguán"],
  "Ciego de Ávila": ["Ciego de Ávila", "Morón"],
  "Camagüey": ["Camagüey", "Florida", "Nuevitas"],
  "Las Tunas": ["Las Tunas", "Puerto Padre"],
  "Holguín": ["Holguín", "Gibara", "Moa", "Banes"],
  "Granma": ["Bayamo", "Manzanillo"],
  "Santiago de Cuba": ["Santiago de Cuba", "Palma Soriano", "Contramaestre"],
  "Guantánamo": ["Guantánamo", "Baracoa"],
  "Pinar del Río": ["Pinar del Río", "Viñales", "San Luis"],
  "Isla de la Juventud": ["Nueva Gerona"],
};

export const TRANSPORT_LABEL: Record<string, string> = {
  tengo: "Tengo transporte",
  sin: "Sin transporte · debe venir",
  voy: "Voy al lugar",
};

export function municipalitiesOf(province: string) {
  return PROVINCES[province] ?? [];
}
