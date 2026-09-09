export type Condition = "nuevo" | "usado" | "sellado";

export type ItemStatus = "activo" | "pausado" | "canjeado";

export type Transport = "tengo" | "sin" | "voy";

export type OfferStatus =
  | "abierta"
  | "pausada"
  | "en_proceso"
  | "completada"
  | "cancelada";

export type TradeStatus =
  | "pendiente"
  | "aceptado"
  | "entregado"
  | "completado"
  | "rechazado"
  | "cancelado";

export type CategoryId =
  | "motos_electricas"
  | "motos_combustion"
  | "repuestos_motos"
  | "carros"
  | "repuestos_carros"
  | "bicicletas"
  | "alquiler_carros"
  | "otros_vehiculos"
  | "casas"
  | "alquiler_cubanos"
  | "alquiler_extranjeros"
  | "alquiler_vacacional"
  | "permutas"
  | "otros_inmobiliaria"
  | "celulares"
  | "televisores"
  | "computadoras"
  | "accesorios_pc"
  | "consolas"
  | "audio"
  | "camaras"
  | "otros_tecnologia"
  | "ofertas_empleo"
  | "busco_empleo"
  | "ropa_mujer"
  | "zapatos_mujer"
  | "ropa_hombre"
  | "zapatos_hombre"
  | "relojes_joyas"
  | "belleza_maquillaje"
  | "otros_ropa"
  | "construccion_mantenimiento"
  | "catering"
  | "belleza_salud_servicio"
  | "talleres"
  | "eventos"
  | "limpieza"
  | "clases"
  | "informatica_marketing"
  | "transporte_logistica"
  | "otros_servicios"
  | "refrigeradores"
  | "lavadoras"
  | "cocinas"
  | "ventiladores"
  | "aire_acondicionado"
  | "pequeno_electro"
  | "otros_electro"
  | "muebles"
  | "arte_antiguedades"
  | "plantas_energia"
  | "materiales_construccion"
  | "ferreteria"
  | "articulos_hogar"
  | "otros_hogar"
  | "salud_bienestar"
  | "alimentos_bebidas"
  | "ropa_ninos"
  | "articulos_bebe"
  | "juguetes"
  | "utiles_escolares"
  | "otros_familia"
  | "mascotas"
  | "instrumentos"
  | "deportes"
  | "suplementos"
  | "peliculas_libros"
  | "otros_general";

export type ZkProofPublic = {
  merkleRoot: string;
  threshold: number;
  minRatingX10: number;
  nullifier: string;
  count: number;
  avgX10: number;
};

export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  phone: string | null;
  phoneVerified: boolean;
  province: string;
  municipality: string;
  neighborhood: string;
  transport: Transport;
  ratingAvg: number;
  ratingCount: number;
  tradesCompleted: number;
  verified: boolean;
  createdAt: string;
  npub?: string | null;
  pubkeyHex?: string | null;
  silentPaymentCode?: string | null;
  zkNullifier?: string | null;
  zkProof?: { publicSignals?: ZkProofPublic } | null;
};

export type Item = {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: CategoryId;
  condition: Condition;
  photos: string[];
  status: ItemStatus;
  createdAt: string;
};

export type Want = {
  title: string;
  category: CategoryId | "abierto";
  notes?: string;
};

export type Offer = {
  id: string;
  userId: string;
  itemIds: string[];
  wants: Want[];
  openToProposals: boolean;
  message: string;
  province: string;
  municipality: string;
  neighborhood: string;
  transport: Transport;
  status: OfferStatus;
  featured: boolean;
  views: number;
  createdAt: string;
  /** Última edición; si falta, se trata como createdAt. */
  updatedAt?: string;
  nostrEventId?: string | null;
};

export type Trade = {
  id: string;
  offerId: string;
  ownerId: string;
  applicantId: string;
  proposedItemIds: string[];
  proposalNote: string;
  status: TradeStatus;
  ownerDelivered: boolean;
  applicantDelivered: boolean;
  ownerRated: boolean;
  applicantRated: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ChatMessage = {
  id: string;
  tradeId: string;
  senderId: string;
  text: string;
  createdAt: string;
  scheme?: "nip44" | "legacy";
  ciphertext?: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: string;
};

export type Rating = {
  id: string;
  tradeId: string;
  fromId: string;
  toId: string;
  stars: number;
  comment: string;
  tags: string[];
  createdAt: string;
};

export type AppState = {
  users: User[];
  items: Item[];
  offers: Offer[];
  trades: Trade[];
  messages: ChatMessage[];
  notifications: Notification[];
  ratings: Rating[];
  currentUserId: string | null;
};
