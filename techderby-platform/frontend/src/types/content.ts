export type EventSpeakerCard = {
  name: string;
  role: string;
  organisation: string;
  credibilityLine: string;
  talkTitle: string;
  outcomes: string[];
};

export type Event = {
  id: number;
  title: string;
  slug: string;
  description: string;
  date: string;
  venue: string;
  eventSource?: string | null;
  theme?: string | null;
  shortLine?: string | null;
  eventRegistrationLink?: string | null;
  agenda?: string | null;
  agendaItems?: string[];
  speakers?: string[];
  speakerCards?: EventSpeakerCard[];
  registrationLink?: string | null;
};

export type Partner = {
  id: number;
  name: string;
  logo?: string;
  description: string;
  website?: string;
  partnerType?: string;
  category: string;
};

export type Programme = {
  id: number;
  title: string;
  slug: string;
  description: string;
};

export type Insight = {
  id: number;
  title: string;
  slug: string;
  featuredImage: string;
  content: string;
  author: string;
  tags: string[];
  category: string;
  createdAt?: string;
  publishedAt?: string;
};

export type Member = {
  id: number;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  interests: string[];
  linkedin?: string;
};
