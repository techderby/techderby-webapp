export type MemberRole = 'member' | 'editor' | 'admin' | 'super-admin';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  occupation?: string;
  skills?: string[];
  certifications?: string[];
  isVisible?: boolean;
  avatar?: string;
  socialLinks?: Record<string, string>;
  memberRole: MemberRole;
  confirmed: boolean;
  blocked: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  jwt: string;
  user: AuthUser;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  identifier: string; // username or email
  password: string;
}

export interface ProfileUpdateInput {
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  occupation?: string;
  skills?: string[];
  certifications?: string[];
  isVisible?: boolean;
  avatar?: string;
  socialLinks?: Record<string, string>;
}

export interface DirectoryMember {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  occupation?: string;
  skills?: string[];
  avatar?: string;
  memberRole: MemberRole;
  linkedinUrl?: string;
  createdAt?: string;
}

export interface Connection {
  id: number;
  requesterId: number;
  recipientId: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  otherUser: DirectoryMember | null;
  direction: 'sent' | 'received';
}

export interface Message {
  id: number;
  fromUserId: number;
  toUserId: number;
  content: string;
  readAt: string | null;
  createdAt: string;
}

export interface InboxThread {
  partner: Pick<DirectoryMember, 'id' | 'username' | 'firstName' | 'lastName' | 'occupation' | 'avatar'> | null;
  latestMessage: Message | null;
  unreadCount: number;
}
