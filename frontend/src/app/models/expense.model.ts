import { User } from './user.model';
import { Group } from './group.model';
import { ExpenseShare } from './expense-share.model';

export interface Expense {
  id?: number;
  description: string;
  amount: number;
  paidBy?: User;
  group?: Group;
  splitType: SplitType;
  shares?: ExpenseShare[];
  date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum SplitType {
  EQUAL = 'EQUAL',
  PERCENTAGE = 'PERCENTAGE',
  CUSTOM = 'CUSTOM'
}

export interface ExpenseDto {
  id?: number;
  description: string;
  amount: number;
  paidById?: number;
  groupId?: number;
  splitType: SplitType;
  date?: Date;
  shares?: ExpenseShareDto[];
}

export interface ExpenseShareDto {
  id?: number;
  expenseId?: number;
  userId: number;
  amount: number;
  percentage?: number;
}
