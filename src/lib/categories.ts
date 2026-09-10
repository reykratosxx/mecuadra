import type { CategoryId } from "./types";

export type CategoryGroupId =
  | "vehiculos"
  | "inmobiliaria"
  | "tecnologia"
  | "empleos"
  | "ropa"
  | "servicios"
  | "electrodomesticos"
  | "hogar"
  | "familia"
  | "general";

export type CategoryGroup = {
  id: CategoryGroupId;
  label: string;
  labelEs: string;
  emoji: string;
  categories: { id: CategoryId; label: string; labelEs: string; hint?: string }[];
};

export function localizedName(
  item: { label: string; labelEs: string },
  locale: string,
) {
  return locale === "es" ? item.labelEs : item.label;
}

/** Revolico-style taxonomy: group → concrete subcategories. */
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: "vehiculos",
    label: "Vehicles",
    labelEs: "Vehículos",
    emoji: "🚗",
    categories: [
      { id: "motos_electricas", label: "E-bikes & trikes", labelEs: "Motos eléctricas y triciclos" },
      { id: "motos_combustion", label: "Gas motorcycles", labelEs: "Motos de combustión" },
      { id: "repuestos_motos", label: "Motorcycle parts", labelEs: "Repuestos de motos" },
      { id: "carros", label: "Cars", labelEs: "Carros" },
      { id: "repuestos_carros", label: "Car parts", labelEs: "Repuestos de carros" },
      { id: "bicicletas", label: "Bicycles", labelEs: "Bicicletas" },
      { id: "alquiler_carros", label: "Car rental", labelEs: "Alquiler de carros" },
      { id: "otros_vehiculos", label: "Other · Vehicles", labelEs: "Otros · Vehículos" },
    ],
  },
  {
    id: "inmobiliaria",
    label: "Housing",
    labelEs: "Inmobiliaria",
    emoji: "🏢",
    categories: [
      { id: "casas", label: "Homes", labelEs: "Casas" },
      { id: "alquiler_cubanos", label: "Long-term rental", labelEs: "Alquiler de larga duración" },
      { id: "alquiler_extranjeros", label: "Rental for visitors", labelEs: "Alquiler a visitantes" },
      { id: "alquiler_vacacional", label: "Vacation rental", labelEs: "Alquiler vacacional" },
      { id: "permutas", label: "Home swaps", labelEs: "Permutas" },
      { id: "otros_inmobiliaria", label: "Other · Housing", labelEs: "Otros · Inmobiliaria" },
    ],
  },
  {
    id: "tecnologia",
    label: "Tech",
    labelEs: "Tecnología",
    emoji: "💻",
    categories: [
      { id: "celulares", label: "Phones & accessories", labelEs: "Celulares y accesorios" },
      { id: "televisores", label: "TVs", labelEs: "Televisores e imagen" },
      { id: "computadoras", label: "Computers & tablets", labelEs: "Computadoras y tablets" },
      { id: "accesorios_pc", label: "PC accessories", labelEs: "Accesorios de computadoras" },
      { id: "consolas", label: "Consoles & games", labelEs: "Consolas y videojuegos" },
      { id: "audio", label: "Headphones & audio", labelEs: "Audífonos, bocinas y sonido" },
      { id: "camaras", label: "Cameras", labelEs: "Cámaras y fotografía" },
      { id: "otros_tecnologia", label: "Other · Tech", labelEs: "Otros · Tecnología" },
    ],
  },
  {
    id: "empleos",
    label: "Jobs",
    labelEs: "Empleos",
    emoji: "💼",
    categories: [
      { id: "ofertas_empleo", label: "Job offers", labelEs: "Ofertas de empleo" },
      { id: "busco_empleo", label: "Looking for work", labelEs: "Busco empleo" },
    ],
  },
  {
    id: "ropa",
    label: "Clothes & accessories",
    labelEs: "Ropa y accesorios",
    emoji: "👕",
    categories: [
      { id: "ropa_mujer", label: "Women’s clothing", labelEs: "Ropa de mujer" },
      { id: "zapatos_mujer", label: "Women’s shoes", labelEs: "Zapatos de mujer" },
      { id: "ropa_hombre", label: "Men’s clothing", labelEs: "Ropa de hombre" },
      { id: "zapatos_hombre", label: "Men’s shoes", labelEs: "Zapatos de hombre" },
      { id: "relojes_joyas", label: "Watches & jewelry", labelEs: "Relojes, joyas y accesorios" },
      { id: "belleza_maquillaje", label: "Beauty & perfume", labelEs: "Belleza, maquillaje y perfumes" },
      { id: "otros_ropa", label: "Other · Clothes", labelEs: "Otros · Ropa y accesorios" },
    ],
  },
  {
    id: "servicios",
    label: "Services",
    labelEs: "Servicios",
    emoji: "🔧",
    categories: [
      { id: "construccion_mantenimiento", label: "Building & maintenance", labelEs: "Construcción y mantenimiento" },
      { id: "catering", label: "Catering & food delivery", labelEs: "Catering y comida a domicilio" },
      { id: "belleza_salud_servicio", label: "Beauty & personal care", labelEs: "Belleza, salud y cuidado personal" },
      { id: "talleres", label: "Workshops & repairs", labelEs: "Talleres y reparaciones" },
      { id: "eventos", label: "Events & entertainment", labelEs: "Eventos y entretenimiento" },
      { id: "limpieza", label: "Cleaning", labelEs: "Limpieza y cuidado" },
      { id: "clases", label: "Classes & courses", labelEs: "Clases y cursos" },
      { id: "informatica_marketing", label: "IT, design & marketing", labelEs: "Informática, creatividad y marketing" },
      { id: "transporte_logistica", label: "Transport & logistics", labelEs: "Transporte y logística" },
      { id: "otros_servicios", label: "Other · Services", labelEs: "Otros · Servicios" },
    ],
  },
  {
    id: "electrodomesticos",
    label: "Appliances",
    labelEs: "Electrodomésticos",
    emoji: "📺",
    categories: [
      { id: "refrigeradores", label: "Fridges", labelEs: "Refrigeradores y neveras" },
      { id: "lavadoras", label: "Washers & dryers", labelEs: "Lavadoras y secadoras" },
      { id: "cocinas", label: "Stoves & ovens", labelEs: "Cocinas y hornos" },
      { id: "ventiladores", label: "Fans", labelEs: "Ventiladores" },
      { id: "aire_acondicionado", label: "Air conditioning", labelEs: "Aire acondicionado" },
      { id: "pequeno_electro", label: "Small appliances", labelEs: "Pequeño electrodoméstico" },
      { id: "otros_electro", label: "Other · Appliances", labelEs: "Otros · Electrodomésticos" },
    ],
  },
  {
    id: "hogar",
    label: "Home",
    labelEs: "Hogar",
    emoji: "🏠",
    categories: [
      { id: "muebles", label: "Furniture", labelEs: "Muebles" },
      { id: "arte_antiguedades", label: "Art & collectibles", labelEs: "Arte, antigüedades y colección" },
      { id: "plantas_energia", label: "Power stations", labelEs: "Plantas y estaciones de energía" },
      { id: "materiales_construccion", label: "Building materials", labelEs: "Materiales de construcción" },
      { id: "ferreteria", label: "Tools & hardware", labelEs: "Ferretería y herramientas" },
      { id: "articulos_hogar", label: "Household goods", labelEs: "Artículos del hogar" },
      { id: "otros_hogar", label: "Other · Home", labelEs: "Otros · Hogar" },
    ],
  },
  {
    id: "familia",
    label: "Family",
    labelEs: "Familia",
    emoji: "👨‍👩‍👧‍👦",
    categories: [
      { id: "salud_bienestar", label: "Health & wellness", labelEs: "Salud y bienestar" },
      { id: "alimentos_bebidas", label: "Food & drinks", labelEs: "Alimentos y bebidas" },
      { id: "ropa_ninos", label: "Kids’ clothes", labelEs: "Ropa y zapatos de niños" },
      { id: "articulos_bebe", label: "Baby gear", labelEs: "Artículos de bebé" },
      { id: "juguetes", label: "Toys", labelEs: "Juguetes" },
      { id: "utiles_escolares", label: "School supplies", labelEs: "Útiles escolares y mochilas" },
      { id: "otros_familia", label: "Other · Family", labelEs: "Otros · Familia" },
    ],
  },
  {
    id: "general",
    label: "General",
    labelEs: "General",
    emoji: "🛒",
    categories: [
      { id: "mascotas", label: "Pet supplies", labelEs: "Productos para mascotas" },
      { id: "instrumentos", label: "Musical instruments", labelEs: "Instrumentos musicales" },
      { id: "deportes", label: "Sports gear", labelEs: "Artículos deportivos" },
      { id: "suplementos", label: "Sports nutrition", labelEs: "Suplementos y nutrición deportiva" },
      { id: "peliculas_libros", label: "Movies, music & books", labelEs: "Películas, música y libros" },
      { id: "otros_general", label: "Other · General", labelEs: "Otros · General" },
    ],
  },
];

export const CATEGORIES = CATEGORY_GROUPS.flatMap((g) =>
  g.categories.map((c) => ({
    ...c,
    groupId: g.id,
    groupLabel: g.label,
    hint: c.hint ?? g.label,
  })),
);

export const LEGACY_CATEGORY_MAP: Record<string, CategoryId> = {
  alimentos: "alimentos_bebidas",
  aseo: "articulos_hogar",
  cuidado: "belleza_maquillaje",
  medicamentos: "salud_bienestar",
  bebidas: "alimentos_bebidas",
  tabaco: "otros_general",
  ropa: "otros_ropa",
  hogar: "articulos_hogar",
  ninos: "ropa_ninos",
  otros: "otros_general",
};

export const CONDITIONS: { id: import("./types").Condition; label: string; labelEs: string }[] = [
  { id: "nuevo", label: "New", labelEs: "Nuevo" },
  { id: "usado", label: "Used", labelEs: "Usado" },
  { id: "sellado", label: "Sealed", labelEs: "Sellado" },
];

export function normalizeCategoryId(raw: string): CategoryId {
  if (CATEGORIES.some((c) => c.id === raw)) return raw as CategoryId;
  return LEGACY_CATEGORY_MAP[raw] ?? "otros_general";
}

export function categoryLabel(id: CategoryId | "abierto" | string, locale: string = "en") {
  if (id === "abierto") return locale === "es" ? "Escucho propuestas" : "Open to proposals";
  const modern = CATEGORIES.find((c) => c.id === id);
  if (modern) return localizedName(modern, locale);
  const mapped = LEGACY_CATEGORY_MAP[id];
  if (mapped) {
    const found = CATEGORIES.find((c) => c.id === mapped);
    return found ? localizedName(found, locale) : id;
  }
  return id;
}

export function categoryGroupOf(id: CategoryId | string) {
  const nid = normalizeCategoryId(id);
  return CATEGORY_GROUPS.find((g) => g.categories.some((c) => c.id === nid));
}

export function categoriesInGroup(groupId: CategoryGroupId): CategoryId[] {
  return (
    CATEGORY_GROUPS.find((g) => g.id === groupId)?.categories.map((c) => c.id) ?? []
  );
}
