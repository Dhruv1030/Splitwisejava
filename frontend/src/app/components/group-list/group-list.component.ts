import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { Group } from '../../models/group.model';
import { User } from '../../models/user.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

// Mock group interface for now
interface MockGroup {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  totalExpenses: number;
  yourBalance: number;
  createdAt: string;
  iconUrl?: string;
}

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  groups: MockGroup[] = [];
  filteredGroups: MockGroup[] = [];
  currentUser: User | null = null;
  loading = false;
  searchTerm = '';
  selectedFilter = 'all';

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadGroups();
  }

  loadGroups(): void {
    this.loading = true;
    
    // Simulate API call with timeout
    setTimeout(() => {
      this.groups = [
        {
          id: 1,
          name: 'Weekend Trip',
          description: 'Our amazing weekend getaway expenses',
          memberCount: 4,
          totalExpenses: 524.80,
          yourBalance: -60.25,
          createdAt: '2025-01-15',
          iconUrl: 'https://via.placeholder.com/40?text=�️'
        },
        {
          id: 2,
          name: 'Trip to Paris',
          description: 'European vacation expenses',
          memberCount: 3,
          totalExpenses: 1240.50,
          yourBalance: 125.75,
          createdAt: '2025-02-01',
          iconUrl: 'https://via.placeholder.com/40?text=✈️'
        },
        {
          id: 3,
          name: 'Office Lunch',
          description: 'Regular office lunch expenses',
          memberCount: 8,
          totalExpenses: 456.90,
          yourBalance: 0,
          createdAt: '2025-02-10',
          iconUrl: 'https://via.placeholder.com/40?text=🍽️'
        }
      ];
      this.filteredGroups = [...this.groups];
      this.loading = false;
    }, 1000);
  }

  filterGroups(): void {
    let filtered = this.groups;

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(term) ||
        (group.description && group.description.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    switch (this.selectedFilter) {
      case 'active':
        filtered = filtered.filter(group => group.yourBalance !== 0);
        break;
      case 'settled':
        filtered = filtered.filter(group => group.yourBalance === 0);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    this.filteredGroups = filtered;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterGroups();
  }

  getGroupInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getBalanceClass(balance: number): string {
    if (balance > 0) return 'positive';
    if (balance < 0) return 'negative';
    return 'neutral';
  }

  getSettlementPercentage(group: MockGroup): number {
    // Mock calculation - in real app, this would be based on actual settlement data
    if (group.yourBalance === 0) return 100;
    return Math.max(0, Math.min(100, 75 - Math.abs(group.yourBalance)));
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  onCreateGroup(): void {
    this.snackBar.open('Create Group feature is being updated. Please check back soon!', 'Close', { 
      duration: 3000 
    });
    
    // TODO: Implement create group dialog
    /*
    const dialogRef = this.dialog.open(AddGroupComponent, {
      width: '500px',
      data: { currentUser: this.currentUser }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGroups();
        this.snackBar.open('Group created successfully!', 'Close', { duration: 3000 });
      }
    });
    */
  }

  onGroupClick(group: MockGroup): void {
    this.snackBar.open(`Opening ${group.name} details...`, 'Close', { duration: 2000 });
    // TODO: Navigate to group details
  }

  onViewExpenses(group: MockGroup): void {
    this.snackBar.open(`Viewing expenses for ${group.name}...`, 'Close', { duration: 2000 });
    // TODO: Navigate to expenses view for this group
  }

  onEditGroup(group: MockGroup): void {
    this.snackBar.open(`Edit group feature coming soon!`, 'Close', { duration: 2000 });
    // TODO: Open edit group dialog
  }

  onShareGroup(group: MockGroup): void {
    this.snackBar.open(`Share group feature coming soon!`, 'Close', { duration: 2000 });
    // TODO: Open share group dialog
  }

  onSettleUp(group: MockGroup): void {
    this.snackBar.open(`Settle up feature for ${group.name} coming soon!`, 'Close', { duration: 3000 });
  }

  onDeleteGroup(group: MockGroup): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Group',
        message: `Are you sure you want to delete "${group.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groups = this.groups.filter(g => g.id !== group.id);
        this.snackBar.open('Group deleted successfully!', 'Close', { duration: 3000 });
      }
    });
  }

  getBalanceColor(balance: number): string {
    if (balance > 0) return 'primary';
    if (balance < 0) return 'warn';
    return 'accent';
  }

  getBalanceText(balance: number): string {
    if (balance > 0) return `You are owed $${Math.abs(balance).toFixed(2)}`;
    if (balance < 0) return `You owe $${Math.abs(balance).toFixed(2)}`;
    return 'All settled up';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}