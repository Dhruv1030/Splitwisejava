import { Injectable, Signal, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateExpenseRequest, Expense } from '../models/expense.model';
import { Observable, catchError, of, tap } from 'rxjs';
import { FakeAuthService } from '../services/fake-auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensesState {
  // Signal for expenses collection
  private expenses = signal<Expense[]>([]);

  // Signal for loading state
  private loading = signal<boolean>(false);
  
  // Signal for error state
  private error = signal<string | null>(null);

  // Signal for the active group ID
  private activeGroupId = signal<string | null>(null);

  // Computed signals for derived state
  public expenses$: Signal<Expense[]> = computed(() => this.expenses());
  public loading$: Signal<boolean> = computed(() => this.loading());
  public error$: Signal<string | null> = computed(() => this.error());

  // Computed signal for expenses of the active group
  public activeGroupExpenses$: Signal<Expense[]> = computed(() => {
    const groupId = this.activeGroupId();
    if (!groupId) return [];
    
    return this.expenses().filter(expense => expense.group?.id === groupId);
  });

  // Computed signals for user balances
  public youOwe$: Signal<number> = computed(() => {
    const currentUser = this.authService.currentUser;
    if (!currentUser) return 0;
    
    let totalOwed = 0;
    this.expenses().forEach(expense => {
      if (expense.paidBy.id !== currentUser.id) {
        const userShare = expense.shares.find(share => 
          share.user.id === currentUser.id && !share.isPaid
        );
        if (userShare) {
          totalOwed += userShare.amount;
        }
      }
    });
    return totalOwed;
  });

  public youAreOwed$: Signal<number> = computed(() => {
    const currentUser = this.authService.currentUser;
    if (!currentUser) return 0;
    
    return this.expenses()
      .filter(expense => expense.paidBy.id === currentUser.id)
      .flatMap(expense => expense.shares)
      .filter(share => share.user.id !== currentUser.id && !share.isPaid)
      .reduce((total, share) => total + share.amount, 0);
  });

  public netBalance$: Signal<number> = computed(() => {
    return this.youAreOwed$() - this.youOwe$();
  });

  constructor(
    private http: HttpClient,
    private authService: FakeAuthService
  ) {}

  setActiveGroupId(groupId: string | null): void {
    this.activeGroupId.set(groupId);
  }

  loadGroupExpenses(groupId: string): Observable<Expense[]> {
    this.loading.set(true);
    this.error.set(null);
    this.setActiveGroupId(groupId);
    
    return this.http.get<Expense[]>(`/api/groups/${groupId}/expenses`)
      .pipe(
        tap(expenses => {
          // Merge with existing expenses from other groups
          const otherExpenses = this.expenses().filter(e => e.group?.id !== groupId);
          this.expenses.set([...otherExpenses, ...expenses]);
          this.loading.set(false);
        }),
        catchError(err => {
          this.error.set('Failed to load expenses');
          this.loading.set(false);
          return of([]);
        })
      );
  }

  createExpense(expenseData: CreateExpenseRequest): Observable<Expense> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<Expense>('/api/expenses', expenseData)
      .pipe(
        tap(newExpense => {
          // Update expenses signal with new expense
          this.expenses.update(expenses => [...expenses, newExpense]);
          this.loading.set(false);
        }),
        catchError(err => {
          this.error.set('Failed to create expense');
          this.loading.set(false);
          throw err;
        })
      );
  }
}
