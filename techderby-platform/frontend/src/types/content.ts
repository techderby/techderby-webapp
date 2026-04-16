export type { MemberRole } from './auth';

export type AdminStats = {
  articles: {
    pending: number;
    in_review: number;
    published: number;
    rejected: number;
    total: number;
  };
  author_applications: {
    pending: number;
    total: number;
  };
  users: {
    total: number;
    by_role: Record<string, number>;
  };
  recent_submissions: Array<{
    id: number;
    title: string;
    author_id: number;
    created_at: string;
    tags?: string[] | null;
  }>;
};

export type AdminUser = {
  id: number;
  username: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  member_role: import('./auth').MemberRole;
  occupation?: string | null;
  avatar?: string | null;
  confirmed: boolean;
  blocked: boolean;
  created_at?: string;
};

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

export type ArticleStatus = 'draft' | 'submitted' | 'in_review' | 'published' | 'rejected';

export type Article = {
  id: number;
  title: string;
  slug?: string | null;
  excerpt?: string | null;
  content: Record<string, unknown> | null;
  coverImageUrl?: string | null;
  featuredImage?: string | null;
  tags?: string[] | null;
  status: ArticleStatus;
  authorName?: string | null;
  authorAvatar?: string | null;
  authorOccupation?: string | null;
  readTime?: number | null;
  views?: number;
  likes?: number;
  createdAt?: string | null;
  publishedAt?: string | null;
  reviewNotes?: string | null;
};

export type ArticleComment = {
  id: number;
  body: string;
  authorId: number;
  authorName?: string | null;
  authorAvatar?: string | null;
  createdAt?: string | null;
};

export type AuthorApplication = {
  id: number;
  bio: string;
  expertise: string[];
  portfolio?: string;
  sampleWork?: string;
  applicationStatus: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string;
  createdAt: string;
  applicant?: {
    id: number;
    username: string;
    first_name?: string | null;
    last_name?: string | null;
    occupation?: string | null;
    bio?: string | null;
    avatar?: string | null;
  } | null;
};
