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
  currentUser: User | null = null;
  loading = false;

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
    
    // Mock data for now - replace with real API call later
    setTimeout(() => {
      this.groups = [
        {
          id: 1,
          name: 'Roommates',
          description: 'Apartment expenses and utilities',
          memberCount: 4,
          totalExpenses: 1250.75,
          yourBalance: -125.50,
          createdAt: '2025-01-15',
          iconUrl: 'https://via.placeholder.com/40?text=🏠'
        },
        {
          id: 2,
          name: 'Weekend Trip',
          description: 'Vacation expenses for our group trip',
          memberCount: 6,
          totalExpenses: 2840.25,
          yourBalance: 245.80,
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
      this.loading = false;
    }, 1000);

    // TODO: Replace with real API call
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