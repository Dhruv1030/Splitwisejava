import { User } from './user.model';
import { Expense } from './expense.model';

export interface Group {
  id?: number;
  name: string;
  description?: string;
  createdBy?: User;
  members?: User[];
  expenses?: Expense[];
  createdAt?: Date;
  updatedAt?: Date;
  
  // Enhanced Group Fields
  iconUrl?: string;
  iconName?: string;
  coverImageUrl?: string;
  defaultCurrency?: string;
  groupType?: GroupType;
  privacyLevel?: PrivacyLevel;
  isActive?: boolean;
  isArchived?: boolean;
  simplifyDebts?: boolean;
  autoSettle?: boolean;
  allowMemberAddExpense?: boolean;
  allowMemberEditExpense?: boolean;
  requireApprovalForExpense?: boolean;
  notificationEnabled?: boolean;
}

export interface GroupDto {
  id?: number;
  name: string;
  description?: string;
  createdById?: number;
  memberIds?: number[];
  
  // Enhanced Group Fields
  iconUrl?: string;
  iconName?: string;
  coverImageUrl?: string;
  defaultCurrency?: string;
  groupType?: GroupType;
  privacyLevel?: PrivacyLevel;
  isActive?: boolean;
  isArchived?: boolean;
  simplifyDebts?: boolean;
  autoSettle?: boolean;
  allowMemberAddExpense?: boolean;
  allowMemberEditExpense?: boolean;
  requireApprovalForExpense?: boolean;
  notificationEnabled?: boolean;
}

export enum GroupType {
  GENERAL = 'GENERAL',
  TRIP = 'TRIP',
  HOUSE = 'HOUSE',
  WORK = 'WORK',
  EVENT = 'EVENT',
  OTHER = 'OTHER'
}

export enum PrivacyLevel {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  INVITE_ONLY = 'INVITE_ONLY'
}
