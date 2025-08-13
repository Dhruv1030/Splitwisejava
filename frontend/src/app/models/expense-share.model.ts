import { User } from './user.model';
import { Expense } from './expense.model';

export interface ExpenseShare {
  id?: number;
  expense?: Expense;
  user?: User;
  amount: number;
  percentage?: number;
}
