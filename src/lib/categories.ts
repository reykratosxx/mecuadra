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
  emoji: string;
  categories: { id: CategoryId; label: string; hint?: string }[];
};

/** Taxonomía al estilo Revolico: grupo → subcategorías concretas. */
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: "vehiculos",
    label: "Vehículos",
    emoji: "🚗",
    categories: [
      { id: "motos_electricas", label: "Motos Eléctricas y Triciclos" },
      { id: "motos_combustion", label: "Motos de Combustión" },
      { id: "repuestos_motos", label: "Repuestos y Accesorios de Motos" },
      { id: "carros", label: "Carros" },
      { id: "repuestos_carros", label: "Repuestos y Accesorios de Carros" },
      { id: "bicicletas", label: "Bicicletas" },
      { id: "alquiler_carros", label: "Alquiler de Carros" },
      { id: "otros_vehiculos", label: "Otros · Vehículos" },
    ],
  },
  {
    id: "inmobiliaria",
    label: "Inmobiliaria",
    emoji: "🏢",
    categories: [
      { id: "casas", label: "Casas" },
      { id: "alquiler_cubanos", label: "Alquiler a Cubanos" },
      { id: "alquiler_extranjeros", label: "Alquiler a Extranjeros" },
      { id: "alquiler_vacacional", label: "Alquiler Vacacional" },
      { id: "permutas", label: "Permutas" },
      { id: "otros_inmobiliaria", label: "Otros · Inmobiliaria" },
    ],
  },
  {
    id: "tecnologia",
    label: "Tecnología",
    emoji: "💻",
    categories: [
      { id: "celulares", label: "Celulares y Accesorios" },
      { id: "televisores", label: "Televisores e Imagen" },
      { id: "computadoras", label: "Computadoras y Tablets" },
      { id: "accesorios_pc", label: "Accesorios de Computadoras" },
      { id: "consolas", label: "Consolas y Videojuegos" },
      { id: "audio", label: "Audífonos, Bocinas y Sonido" },
      { id: "camaras", label: "Cámaras y Fotografía" },
      { id: "otros_tecnologia", label: "Otros · Tecnología" },
    ],
  },
  {
    id: "empleos",
    label: "Empleos",
    emoji: "💼",
    categories: [
      { id: "ofertas_empleo", label: "Ofertas de Empleo" },
      { id: "busco_empleo", label: "Busco Empleo" },
    ],
  },
  {
    id: "ropa",
    label: "Ropa y Accesorios",
    emoji: "👕",
    categories: [
      { id: "ropa_mujer", label: "Ropa de Mujer" },
      { id: "zapatos_mujer", label: "Zapatos de Mujer" },
      { id: "ropa_hombre", label: "Ropa de Hombre" },
      { id: "zapatos_hombre", label: "Zapatos de Hombre" },
      { id: "relojes_joyas", label: "Relojes, Joyas y Accesorios" },
      { id: "belleza_maquillaje", label: "Belleza, Maquillaje y Perfumes" },
      { id: "otros_ropa", label: "Otros · Ropa y Accesorios" },
    ],
  },
  {
    id: "servicios",
    label: "Servicios",
    emoji: "🔧",
    categories: [
      { id: "construccion_mantenimiento", label: "Construcción y Mantenimiento" },
      { id: "catering", label: "Catering y Comida a Domicilio" },
      { id: "belleza_salud_servicio", label: "Belleza, Salud y Cuidado Personal" },
      { id: "talleres", label: "Talleres y Reparaciones" },
      { id: "eventos", label: "Eventos y Entretenimiento" },
      { id: "limpieza", label: "Limpieza y Cuidado" },
      { id: "clases", label: "Clases y Cursos" },
      { id: "informatica_marketing", label: "Informática, Creatividad y Marketing" },
      { id: "transporte_logistica", label: "Transporte y Logística" },
      { id: "otros_servicios", label: "Otros · Servicios" },
    ],
  },
  {
    id: "electrodomesticos",
    label: "Electrodomésticos",
    emoji: "📺",
    categories: [
      { id: "refrigeradores", label: "Refrigeradores y Neveras" },
      { id: "lavadoras", label: "Lavadoras y Secadoras" },
      { id: "cocinas", label: "Cocinas y Hornos" },
      { id: "ventiladores", label: "Ventiladores" },
      { id: "aire_acondicionado", label: "Aire Acondicionado" },
      { id: "pequeno_electro", label: "Pequeño Electrodoméstico" },
      { id: "otros_electro", label: "Otros · Electrodomésticos" },
    ],
  },
  {
    id: "hogar",
    label: "Hogar",
    emoji: "🏠",
    categories: [
      { id: "muebles", label: "Muebles" },
      { id: "arte_antiguedades", label: "Arte, Antigüedades y Colección" },
      { id: "plantas_energia", label: "Plantas y Estaciones de Energía" },
      { id: "materiales_construccion", label: "Materiales de Construcción" },
      { id: "ferreteria", label: "Ferretería y Herramientas" },
      { id: "articulos_hogar", label: "Artículos del Hogar" },
      { id: "otros_hogar", label: "Otros · Hogar" },
    ],
  },
  {
    id: "familia",
    label: "Familia",
    emoji: "👨‍👩‍👧‍👦",
    categories: [
      { id: "salud_bienestar", label: "Salud y Bienestar" },
      { id: "alimentos_bebidas", label: "Alimentos y Bebidas" },
      { id: "ropa_ninos", label: "Ropa y Zapatos de Niños" },
      { id: "articulos_bebe", label: "Artículos de Bebé" },
      { id: "juguetes", label: "Juguetes" },
      { id: "utiles_escolares", label: "Útiles Escolares y Mochilas" },
      { id: "otros_familia", label: "Otros · Familia" },
    ],
  },
  {
    id: "general",
    label: "General",
    emoji: "🛒",
    categories: [
      { id: "mascotas", label: "Productos para Mascotas" },
      { id: "instrumentos", label: "Instrumentos Musicales" },
      { id: "deportes", label: "Artículos Deportivos" },
      { id: "suplementos", label: "Suplementos y Nutrición Deportiva" },
      { id: "peliculas_libros", label: "Películas, Música y Libros" },
      { id: "otros_general", label: "Otros · General" },
    ],
  },
];

/** Lista plana de subcategorías (formularios y etiquetas). */
export const CATEGORIES = CATEGORY_GROUPS.flatMap((g) =>
  g.categories.map((c) => ({
    ...c,
    groupId: g.id,
    groupLabel: g.label,
    hint: c.hint ?? g.label,
  })),
);

/** Categorías antiguas → nuevas (datos previos / seed). */
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

export const CONDITIONS: { id: import("./types").Condition; label: string }[] = [
  { id: "nuevo", label: "Nuevo" },
  { id: "usado", label: "Usado" },
  { id: "sellado", label: "Sellado" },
];

export function normalizeCategoryId(raw: string): CategoryId {
  if (CATEGORIES.some((c) => c.id === raw)) return raw as CategoryId;
  return LEGACY_CATEGORY_MAP[raw] ?? "otros_general";
}

export function categoryLabel(id: CategoryId | "abierto" | string) {
  if (id === "abierto") return "Escucho propuestas";
  const modern = CATEGORIES.find((c) => c.id === id);
  if (modern) return modern.label;
  const mapped = LEGACY_CATEGORY_MAP[id];
  if (mapped) return CATEGORIES.find((c) => c.id === mapped)?.label ?? id;
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
