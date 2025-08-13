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
}

export interface GroupDto {
  id?: number;
  name: string;
  description?: string;
  createdById?: number;
  memberIds?: number[];
}
