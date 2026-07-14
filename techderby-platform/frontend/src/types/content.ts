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
  documentId?: string;
  title: string;
  slug: string;
  featuredImage?: string;
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
  publishedAt?: string;
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
  documentId?: string;
  title: string;
  slug: string;
  featuredImage: string;
  featuredImageUrl?: string;
  content: string;
  author: string;
  authorUserId?: number;
  excerpt?: string;
  tags: string[];
  category: string;
  workflowStatus?: ArticleStatus;
  reviewNotes?: string | null;
  readCount?: number;
  likeCount?: number;
  commentCount?: number;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};

export type ArticleStatus = 'draft' | 'pending-review' | 'published' | 'rejected' | 'update-requested';

export type ArticleStats = {
  total: number;
  draft: number;
  pendingReview: number;
  published: number;
  rejected: number;
  updateRequested: number;
  totalReads: number;
  totalLikes: number;
  totalComments: number;
  badges: string[];
  writers?: number;
  pendingWriters?: number;
};

export type WriterApplication = {
  id: number;
  userId: number;
  name: string;
  email: string;
  motivation: string;
  experience?: string | null;
  portfolioUrl?: string | null;
  topics?: string[];
  status: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string | null;
  createdAt?: string;
};

export type ArticleComment = {
  id: number;
  name: string;
  content: string;
  createdAt: string;
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
