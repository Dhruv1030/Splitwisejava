import { User } from './auth.model';

export interface Group {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  members: GroupMember[];
  type: 'apartment' | 'trip' | 'couple' | 'other';
  imageUrl?: string;
  isPrivate: boolean;
}

export interface GroupMember {
  user: User;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  type: 'apartment' | 'trip' | 'couple' | 'other';
  isPrivate: boolean;
  memberIds?: string[];
}
