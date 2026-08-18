import type {
  CategoryId,
  Condition,
  Item,
  ItemStatus,
  Notification,
  Offer,
  OfferStatus,
  Rating,
  Trade,
  TradeStatus,
  Transport,
  User,
  Want,
} from "./types";

type ProfileRow = {
  id: string;
  username: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  phone_verified: boolean;
  province: string;
  municipality: string;
  neighborhood: string | null;
  transport: Transport;
  rating_avg: number;
  rating_count: number;
  trades_completed: number;
  verified: boolean;
  created_at: string;
};

type ItemRow = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: CategoryId;
  condition: Condition;
  photos: string[];
  status: ItemStatus;
  created_at: string;
};

type OfferRow = {
  id: string;
  user_id: string;
  item_ids: string[];
  wants: Want[];
  open_to_proposals: boolean;
  message: string | null;
  province: string;
  municipality: string;
  neighborhood: string | null;
  transport: Transport;
  status: OfferStatus;
  featured: boolean;
  views: number;
  created_at: string;
};

type TradeRow = {
  id: string;
  offer_id: string;
  owner_id: string;
  applicant_id: string;
  proposed_item_ids: string[];
  proposal_note: string | null;
  status: TradeStatus;
  owner_delivered: boolean;
  applicant_delivered: boolean;
  owner_rated: boolean;
  applicant_rated: boolean;
  created_at: string;
  updated_at: string;
};

type NotifRow = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  href: string;
  read: boolean;
  created_at: string;
};

type RatingRow = {
  id: string;
  trade_id: string;
  from_id: string;
  to_id: string;
  stars: number;
  comment: string | null;
  tags: string[] | null;
  created_at: string;
};

export function mapUser(row: ProfileRow, email = ""): User {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    email,
    avatar: row.avatar_url || "",
    bio: row.bio || "",
    phone: row.phone,
    phoneVerified: row.phone_verified,
    province: row.province,
    municipality: row.municipality,
    neighborhood: row.neighborhood || "",
    transport: row.transport,
    ratingAvg: Number(row.rating_avg),
    ratingCount: row.rating_count,
    tradesCompleted: row.trades_completed,
    verified: row.verified,
    createdAt: row.created_at,
  };
}

export function mapItem(row: ItemRow): Item {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    category: row.category,
    condition: row.condition,
    photos: row.photos || [],
    status: row.status,
    createdAt: row.created_at,
  };
}

export function mapOffer(row: OfferRow): Offer {
  return {
    id: row.id,
    userId: row.user_id,
    itemIds: row.item_ids || [],
    wants: row.wants || [],
    openToProposals: row.open_to_proposals,
    message: row.message || "",
    province: row.province,
    municipality: row.municipality,
    neighborhood: row.neighborhood || "",
    transport: row.transport,
    status: row.status,
    featured: row.featured,
    views: row.views,
    createdAt: row.created_at,
  };
}

export function mapTrade(row: TradeRow): Trade {
  return {
    id: row.id,
    offerId: row.offer_id,
    ownerId: row.owner_id,
    applicantId: row.applicant_id,
    proposedItemIds: row.proposed_item_ids || [],
    proposalNote: row.proposal_note || "",
    status: row.status,
    ownerDelivered: row.owner_delivered,
    applicantDelivered: row.applicant_delivered,
    ownerRated: row.owner_rated,
    applicantRated: row.applicant_rated,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapNotif(row: NotifRow): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    body: row.body,
    href: row.href,
    read: row.read,
    createdAt: row.created_at,
  };
}

export function mapRating(row: RatingRow): Rating {
  return {
    id: row.id,
    tradeId: row.trade_id,
    fromId: row.from_id,
    toId: row.to_id,
    stars: row.stars,
    comment: row.comment || "",
    tags: row.tags || [],
    createdAt: row.created_at,
  };
}
