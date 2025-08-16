import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { ExpenseService } from '../../services/expense.service';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { Expense, ExpenseDto, SplitType } from '../../models/expense.model';
import { ExpenseShare } from '../../models/expense-share.model';
import { Group } from '../../models/group.model';
import { User } from '../../models/user.model';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../confirmation-dialog/confirmation-dialog.component';

// Extended interfaces for UI features
interface ExtendedExpenseShare extends ExpenseShare {
  settled?: boolean;
}

interface ExtendedExpense extends Omit<Expense, 'shares'> {
  shares?: ExtendedExpenseShare[];
  category?: string;
}

interface ExpenseSummary {
  youAreOwed: number;
  youOwe: number;
  netBalance: number;
  totalExpenses: number;
}

interface DateRange {
  start: Date | null;
  end: Date | null;
}

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {
  // Core data
  expenses: ExtendedExpense[] = [];
  filteredExpenses: ExtendedExpense[] = [];
  groups: Group[] = [];
  currentUser: User | null = null;
  
  // State management
  selectedGroupId: number | null = null;
  loading = false;
  
  // Search and filtering
  searchQuery = '';
  selectedFilter = 'all'; // all, paid, owe, settled
  dateRange: DateRange = { start: null, end: null };
  
  // Sorting
  sortBy = 'date'; // date, amount, description
  sortDirection: 'asc' | 'desc' = 'desc';
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  paginatedExpenses: ExtendedExpense[] = [];
  
  // Summary
  summary: ExpenseSummary = {
    youAreOwed: 0,
    youOwe: 0,
    netBalance: 0,
    totalExpenses: 0
  };

  // Mock data for development
  mockExpenses: ExtendedExpense[] = [
    {
      id: 1,
      description: 'Dinner at Italian Restaurant',
      amount: 85.60,
      group: { id: 1, name: 'Roommates', description: 'House expenses', members: [] },
      paidBy: { id: 1, username: 'johndoe', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
      splitType: SplitType.EQUAL,
      date: new Date('2024-12-15T19:30:00'),
      category: 'food',
      shares: [
        { user: { id: 1, username: 'johndoe', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }, amount: 28.53, settled: true },
        { user: { id: 2, username: 'sarahw', firstName: 'Sarah', lastName: 'Wilson', email: 'sarah@example.com' }, amount: 28.53, settled: false },
        { user: { id: 3, username: 'mikej', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com' }, amount: 28.54, settled: false }
      ]
    },
    {
      id: 2,
      description: 'Uber to Airport',
      amount: 42.15,
      group: { id: 1, name: 'Roommates', description: 'House expenses', members: [] },
      paidBy: { id: 2, username: 'sarahw', firstName: 'Sarah', lastName: 'Wilson', email: 'sarah@example.com' },
      splitType: SplitType.EQUAL,
      date: new Date('2024-12-14T08:15:00'),
      category: 'transport',
      shares: [
        { user: { id: 1, username: 'johndoe', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }, amount: 21.08, settled: false },
        { user: { id: 2, username: 'sarahw', firstName: 'Sarah', lastName: 'Wilson', email: 'sarah@example.com' }, amount: 21.07, settled: true }
      ]
    },
    {
      id: 3,
      description: 'Groceries for Weekend',
      amount: 127.89,
      group: { id: 2, name: 'Weekend Trip', description: 'Trip expenses', members: [] },
      paidBy: { id: 3, username: 'mikej', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com' },
      splitType: SplitType.EQUAL,
      date: new Date('2024-12-13T14:20:00'),
      category: 'groceries',
      shares: [
        { user: { id: 1, username: 'johndoe', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }, amount: 42.63, settled: false },
        { user: { id: 3, username: 'mikej', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com' }, amount: 42.63, settled: true },
        { user: { id: 4, username: 'emmad', firstName: 'Emma', lastName: 'Davis', email: 'emma@example.com' }, amount: 42.63, settled: false }
      ]
    }
  ];

  constructor(
    private expenseService: ExpenseService,
    private groupService: GroupService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { 
    this.currentUser = { id: 1, username: 'currentuser', firstName: 'Current', lastName: 'User', email: 'current@example.com' };
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser() || this.currentUser;
    this.loadGroups();
    
    // Check if groupId is passed via query params
    this.route.queryParams.subscribe(params => {
      if (params['groupId']) {
        this.selectedGroupId = +params['groupId'];
        this.loadExpenses();
      }
    });

    // Initialize with mock data for development
    this.expenses = [...this.mockExpenses];
    this.applyFilters();
  }

  loadGroups(): void {
    this.loading = true;
    
    // Mock groups for development
    this.groups = [
      { id: 1, name: 'Roommates', description: 'House expenses', members: [] },
      { id: 2, name: 'Weekend Trip', description: 'Trip expenses', members: [] },
      { id: 3, name: 'Office Lunch', description: 'Work expenses', members: [] }
    ];
    
    this.loading = false;

    // Uncomment when backend is ready
    /*
    this.groupService.getUserGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading groups:', error);
        this.snackBar.open('Error loading groups', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
    */
  }

  loadExpenses(): void {
    if (!this.selectedGroupId) {
      this.expenses = [];
      this.applyFilters();
      return;
    }

    this.loading = true;
    
    // Filter mock data by group
    this.expenses = this.mockExpenses.filter(expense => 
      expense.group?.id === this.selectedGroupId
    );
    
    this.loading = false;
    this.applyFilters();

    // Uncomment when backend is ready
    /*
    this.expenseService.getExpensesByGroup(this.selectedGroupId).subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.loading = false;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading expenses:', error);
        this.snackBar.open('Error loading expenses', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
    */
  }

  onGroupChange(): void {
    this.loadExpenses();
    this.currentPage = 0;
  }

  onSearch(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.selectedFilter = 'all';
    this.dateRange = { start: null, end: null };
    this.currentPage = 0;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.expenses];

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(expense => 
        expense.description.toLowerCase().includes(query) ||
        this.getPaidByName(expense).toLowerCase().includes(query) ||
        expense.amount.toString().includes(query)
      );
    }

    // Apply status filter
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(expense => {
        switch (this.selectedFilter) {
          case 'paid':
            return expense.paidBy?.id === this.currentUser?.id;
          case 'owe':
            return this.getYourShare(expense) > 0 && !this.isExpenseSettledForUser(expense);
          case 'settled':
            return this.isExpenseSettled(expense);
          default:
            return true;
        }
      });
    }

    // Apply date range filter
    if (this.dateRange.start || this.dateRange.end) {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date!);
        const start = this.dateRange.start;
        const end = this.dateRange.end;
        
        if (start && expenseDate < start) return false;
        if (end && expenseDate > end) return false;
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (this.sortBy) {
        case 'date':
          aValue = new Date(a.date!);
          bValue = new Date(b.date!);
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        default:
          aValue = new Date(a.date!);
          bValue = new Date(b.date!);
      }

      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.filteredExpenses = filtered;
    this.calculateSummary();
    this.updatePagination();
  }

  calculateSummary(): void {
    let youAreOwed = 0;
    let youOwe = 0;
    let totalExpenses = 0;

    this.filteredExpenses.forEach(expense => {
      totalExpenses += expense.amount;
      
      if (expense.paidBy?.id === this.currentUser?.id) {
        // You paid, calculate how much others owe you
        expense.shares?.forEach(share => {
          if (share.user?.id !== this.currentUser?.id && !(share as ExtendedExpenseShare).settled) {
            youAreOwed += share.amount;
          }
        });
      } else {
        // Someone else paid, calculate how much you owe
        const yourShare = expense.shares?.find(share => share.user?.id === this.currentUser?.id);
        if (yourShare && !(yourShare as ExtendedExpenseShare).settled) {
          youOwe += yourShare.amount;
        }
      }
    });

    this.summary = {
      youAreOwed,
      youOwe,
      netBalance: youAreOwed - youOwe,
      totalExpenses
    };
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredExpenses.length / this.pageSize);
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedExpenses = this.filteredExpenses.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  trackExpenseById(index: number, expense: Expense): number {
    return expense.id!;
  }

  // UI Helper Methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  }

  formatSplitType(splitType: string): string {
    switch (splitType) {
      case 'EQUAL': return 'equally';
      case 'EXACT': return 'by exact amounts';
      case 'PERCENTAGE': return 'by percentage';
      default: return 'equally';
    }
  }

  getGroupName(groupId?: number): string {
    if (!groupId) return 'Unknown Group';
    const group = this.groups.find(g => g.id === groupId);
    return group?.name || 'Unknown Group';
  }

  getGroupInitials(groupName: string): string {
    return groupName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  }

  getPaidByName(expense: Expense): string {
    if (!expense.paidBy) return 'Unknown';
    return `${expense.paidBy.firstName} ${expense.paidBy.lastName}`;
  }

  getParticipantName(userId: number): string {
    // In a real app, you'd have a user service to get user details
    const mockUsers: { [key: number]: string } = {
      1: 'You',
      2: 'Sarah W.',
      3: 'Mike J.',
      4: 'Emma D.'
    };
    return mockUsers[userId] || 'Unknown';
  }

  getExpenseIcon(category?: string): string {
    switch (category) {
      case 'food': return 'restaurant';
      case 'transport': return 'directions_car';
      case 'groceries': return 'local_grocery_store';
      case 'entertainment': return 'movie';
      case 'utilities': return 'bolt';
      case 'rent': return 'home';
      default: return 'receipt_long';
    }
  }

  getExpenseCardClass(expense: Expense): string {
    if (this.isExpenseSettled(expense)) return 'settled';
    if (expense.paidBy?.id === this.currentUser?.id) return 'you-paid';
    return 'you-owe';
  }

  getYourShare(expense: ExtendedExpense): number {
    const share = expense.shares?.find(s => s.user?.id === this.currentUser?.id);
    return share?.amount || 0;
  }

  getYourShareClass(expense: ExtendedExpense): string {
    const yourShare = this.getYourShare(expense);
    const isPaidByYou = expense.paidBy?.id === this.currentUser?.id;
    
    if (yourShare === 0) return 'neutral';
    return isPaidByYou ? 'positive' : 'negative';
  }

  isCurrentUser(userId: number): boolean {
    return userId === this.currentUser?.id;
  }

  isExpenseSettled(expense: ExtendedExpense): boolean {
    return expense.shares?.every(share => (share as ExtendedExpenseShare).settled) || false;
  }

  isExpenseSettledForUser(expense: ExtendedExpense): boolean {
    const userShare = expense.shares?.find(share => share.user?.id === this.currentUser?.id);
    return (userShare as ExtendedExpenseShare)?.settled || false;
  }

  getSettlementStatus(expense: ExtendedExpense): string {
    if (this.isExpenseSettled(expense)) return 'settled';
    return 'pending';
  }

  getSettlementIcon(expense: ExtendedExpense): string {
    return this.isExpenseSettled(expense) ? 'check_circle' : 'pending';
  }

  getSettlementText(expense: ExtendedExpense): string {
    return this.isExpenseSettled(expense) ? 'Settled' : 'Pending';
  }

  canSettleExpense(expense: ExtendedExpense): boolean {
    return !this.isExpenseSettledForUser(expense) && expense.paidBy?.id !== this.currentUser?.id;
  }

  canRemindParticipants(expense: ExtendedExpense): boolean {
    return expense.paidBy?.id === this.currentUser?.id && !this.isExpenseSettled(expense);
  }

  // Action Methods
  openAddExpenseDialog(): void {
    // TODO: Implement add expense dialog
    this.snackBar.open('Add expense feature coming soon!', 'Close', { duration: 3000 });
  }

  editExpense(expense: ExtendedExpense): void {
    // TODO: Implement edit expense
    this.snackBar.open(`Edit expense: ${expense.description}`, 'Close', { duration: 3000 });
  }

  duplicateExpense(expense: ExtendedExpense): void {
    // TODO: Implement duplicate expense
    this.snackBar.open(`Duplicate expense: ${expense.description}`, 'Close', { duration: 3000 });
  }

  deleteExpense(expenseId: number): void {
    const expense = this.expenses.find(e => e.id === expenseId);
    if (!expense) return;

    const dialogData: ConfirmationDialogData = {
      title: 'Delete Expense',
      message: `Are you sure you want to delete "${expense.description}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmColor: 'warn'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Remove from mock data
        const index = this.expenses.findIndex(e => e.id === expenseId);
        if (index > -1) {
          this.expenses.splice(index, 1);
          this.applyFilters();
          this.snackBar.open('Expense deleted successfully', 'Close', { duration: 3000 });
        }
        
        // TODO: Implement actual delete API call
        /*
        this.expenseService.deleteExpense(expenseId).subscribe({
          next: () => {
            this.loadExpenses();
            this.snackBar.open('Expense deleted successfully', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error deleting expense:', error);
            this.snackBar.open('Error deleting expense', 'Close', { duration: 3000 });
          }
        });
        */
      }
    });
  }

  settleExpense(expense: Expense): void {
    // TODO: Implement settle expense
    this.snackBar.open(`Settle expense: ${expense.description}`, 'Close', { duration: 3000 });
  }

  remindParticipants(expense: Expense): void {
    // TODO: Implement remind participants
    this.snackBar.open(`Reminder sent for: ${expense.description}`, 'Close', { duration: 3000 });
  }

  showAllParticipants(expense: Expense): void {
    // TODO: Implement show all participants dialog
    this.snackBar.open(`Show all participants for: ${expense.description}`, 'Close', { duration: 3000 });
  }
}
