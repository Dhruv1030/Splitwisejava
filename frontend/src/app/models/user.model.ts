import { Group } from './group.model';
import { Expense } from './expense.model';
import { ExpenseShare } from './expense-share.model';

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  groups?: Group[];
  expenses?: Expense[];
  expenseShares?: ExpenseShare[];
}

export interface UserDto {
  id?: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
