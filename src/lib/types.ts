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
  | "alimentos"
  | "aseo"
  | "cuidado"
  | "medicamentos"
  | "bebidas"
  | "tabaco"
  | "ropa"
  | "hogar"
  | "ninos"
  | "otros";

export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  province: string;
  municipality: string;
  neighborhood: string;
  transport: Transport;
  ratingAvg: number;
  ratingCount: number;
  tradesCompleted: number;
  verified: boolean;
  createdAt: string;
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
