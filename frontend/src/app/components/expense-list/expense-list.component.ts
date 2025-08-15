import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpenseService } from '../../services/expense.service';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { Expense, ExpenseDto } from '../../models/expense.model';
import { Group } from '../../models/group.model';
import { User } from '../../models/user.model';
// import { AddExpenseComponent } from '../add-expense/add-expense.component';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];
  groups: Group[] = [];
  currentUser: User | null = null;
  selectedGroupId: number | null = null;
  loading = false;
  displayedColumns: string[] = ['description', 'amount', 'paidBy', 'splitType', 'date', 'actions'];

  constructor(
    private expenseService: ExpenseService,
    private groupService: GroupService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadGroups();
    
    // Check if groupId is passed via query params
    this.route.queryParams.subscribe(params => {
      if (params['groupId']) {
        this.selectedGroupId = +params['groupId'];
        this.loadExpenses();
      }
    });
  }

  loadGroups(): void {
    if (!this.currentUser) return;
    
    this.groupService.getGroupsByUserId(this.currentUser.id!).subscribe({
      next: (groups) => {
        this.groups = groups;
      },
      error: (error) => {
        console.error('Error loading groups:', error);
        this.snackBar.open('Error loading groups', 'Close', { duration: 3000 });
      }
    });
  }

  loadExpenses(): void {
    if (!this.selectedGroupId) return;
    
    this.loading = true;
    this.expenseService.getExpensesByGroupId(this.selectedGroupId).subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading expenses:', error);
        this.snackBar.open('Error loading expenses', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onGroupChange(): void {
    this.loadExpenses();
  }

  openAddExpenseDialog(): void {
    if (!this.selectedGroupId) {
      this.snackBar.open('Please select a group first', 'Close', { duration: 3000 });
      return;
    }

    // Get the basic group info
    const selectedGroup = this.groups.find(g => g.id === this.selectedGroupId);
    if (!selectedGroup) return;

    // Fetch the full group details including members
    this.groupService.getGroupById(selectedGroup.id!).subscribe({
      next: (fullGroup) => {
        // Temporarily disabled - AddExpenseComponent needs to be converted to Material Design
        this.snackBar.open('Add Expense feature is being updated. Please check back soon!', 'Close', { 
          duration: 3000 
        });


      },
      error: (error) => {
        console.error('Error fetching group details:', error);
        this.snackBar.open('Failed to load group details. Please try again.', 'Close', { 
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  deleteExpense(expenseId: number): void {
    const expense = this.expenses.find(e => e.id === expenseId);
    if (!expense) return;

    const dialogData: ConfirmationDialogData = {
      title: 'Delete Expense',
      message: `Are you sure you want to delete "${expense.description}" ($${expense.amount})? This action cannot be undone.`,
      confirmText: 'Delete Expense',
      cancelText: 'Cancel',
      type: 'warning'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.expenseService.deleteExpense(expenseId).subscribe({
          next: () => {
            this.loadExpenses();
            this.snackBar.open('Expense deleted successfully!', 'Close', { 
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Error deleting expense:', error);
            this.snackBar.open('Failed to delete expense. Please try again.', 'Close', { 
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  getExpenseTotal(expense: Expense): number {
    return expense.shares ? expense.shares.reduce((sum, share) => sum + share.amount, 0) : 0;
  }

  getExpenseShares(expense: Expense): string {
    if (!expense.shares || expense.shares.length === 0) return '';
    
    return expense.shares
      .map(share => `${share.user?.firstName} ${share.user?.lastName}: $${share.amount}`)
      .join(', ');
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
