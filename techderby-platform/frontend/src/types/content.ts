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

export type ArticleComment = {
  id: number;
  articleId: number;
  authorId: number;
  authorName?: string;
  authorAvatar?: string | null;
  body: string;
  createdAt: string;
};

export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: Record<string, unknown>;
  status: ArticleStatus;
  featuredImage?: string | null;
  coverImageUrl?: string | null;
  tags?: string[];
  readTime?: number;
  reviewNotes?: string;
  views?: number;
  likes?: number;
  authorId: number;
  authorName?: string;
  authorOccupation?: string;
  authorAvatar?: string;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type MemberRole = 'member' | 'editor' | 'admin' | 'super-admin';

export type AdminUser = {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  memberRole?: MemberRole;
  occupation?: string;
  avatar?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
};

export type AdminStats = {
  articles: {
    pending: number;
    inReview: number;
    published: number;
    rejected: number;
    total: number;
  };
  authorApplications: {
    pending: number;
    total: number;
  };
  users: {
    total: number;
    byRole: Record<string, number>;
  };
  recentSubmissions: Array<{
    id: number;
    title: string;
    authorId: number;
    createdAt: string;
    tags?: string[];
  }>;
};

export type AuthorApplicationStatus = 'pending' | 'approved' | 'rejected';

export type AuthorApplication = {
  id: number;
  applicantId: number;
  bio: string;
  expertise?: string[];
  portfolio?: string;
  sampleWork?: string;
  applicationStatus: AuthorApplicationStatus;
  reviewNotes?: string;
  reviewedBy?: number;
  reviewedAt?: string;
  createdAt?: string;
  applicant?: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    occupation?: string;
    avatar?: string;
  };
};
