import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense, ExpenseDto } from '../models/expense.model';
import { ExpenseShare } from '../models/expense-share.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) { }

  createExpense(expenseDto: ExpenseDto): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expenseDto);
  }

  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  getExpensesByGroupId(groupId: number): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/group/${groupId}`);
  }

  getExpensesByUserId(userId: number): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/user/${userId}`);
  }

  updateExpense(id: number, expenseDto: ExpenseDto): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, expenseDto);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTotalOwedByUser(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${userId}/owed`);
  }

  getOwedExpensesByUser(userId: number): Observable<ExpenseShare[]> {
    return this.http.get<ExpenseShare[]>(`${this.apiUrl}/user/${userId}/shares`);
  }
}
