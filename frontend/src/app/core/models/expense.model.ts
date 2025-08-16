import { Group } from './group.model';
import { User } from './auth.model';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: User;
  createdAt: string;
  updatedAt: string;
  group?: Group;
  category: ExpenseCategory;
  shares: ExpenseShare[];
  receipt?: string; // URL to receipt image
}

export interface ExpenseShare {
  user: User;
  amount: number;
  isPaid: boolean;
  paidAt?: string;
}

export type ExpenseCategory = 
  | 'food' 
  | 'rent' 
  | 'utilities' 
  | 'transportation' 
  | 'entertainment' 
  | 'shopping' 
  | 'travel' 
  | 'medical' 
  | 'other';

export interface CreateExpenseRequest {
  description: string;
  amount: number;
  currency: string;
  paidById: string;
  groupId?: string;
  category: ExpenseCategory;
  shares: {
    userId: string;
    amount: number;
  }[];
  receiptImage?: File;
}
