export type MemberRole = 'member' | 'editor' | 'admin' | 'super-admin';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  location?: string;
  occupation?: string;
  skills?: string[];
  certifications?: string[];
  is_visible?: boolean;
  avatar?: string;
  social_links?: Record<string, string>;
  member_role: MemberRole;
  confirmed: boolean;
  blocked: boolean;
  created_at?: string;
}

export interface AuthResponse {
  jwt: string;
  user: AuthUser;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginInput {
  identifier: string; // username or email
  password: string;
}

export interface ProfileUpdateInput {
  first_name?: string;
  last_name?: string;
  bio?: string;
  location?: string;
  occupation?: string;
  skills?: string[];
  certifications?: string[];
  is_visible?: boolean;
  avatar?: string;
  social_links?: Record<string, string>;
}

export interface DirectoryMember {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  location?: string;
  occupation?: string;
  skills?: string[];
  avatar?: string;
  member_role: MemberRole;
  linkedin_url?: string;
  created_at?: string;
}

export interface Connection {
  id: number;
  requester_id: number;
  recipient_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  other_user: DirectoryMember | null;
  direction: 'sent' | 'received';
}

export interface Message {
  id: number;
  from_user_id: number;
  to_user_id: number;
  content: string;
  read_at: string | null;
  created_at: string;
}

export interface InboxThread {
  partner: Pick<DirectoryMember, 'id' | 'username' | 'first_name' | 'last_name' | 'occupation' | 'avatar'> | null;
  latest_message: Message | null;
  unread_count: number;
}
