import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

interface Balance {
  type: 'owed' | 'owes' | 'net';
  amount: number;
  label: string;
}

interface Activity {
  id: string;
  type: 'expense' | 'payment' | 'group';
  description: string;
  amount?: number;
  date: Date;
  user: string;
  group?: string;
}

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit {
  currentUser: User | null = null;
  
  // Updated balance data structure to match template
  balances: Balance[] = [
    { type: 'owed', amount: 67.25, label: 'you are owed' },
    { type: 'owes', amount: 127.50, label: 'you owe' },
    { type: 'net', amount: -60.25, label: 'net balance' }
  ];

  // Mock data for demo - keeping existing structure
  summaryData = {
    totalBalance: -60.25,
    youOwe: 127.50,
    youAreOwed: 67.25,
    monthlyExpenses: 245.75
  };

  recentActivities: Activity[] = [
    {
      id: '1',
      type: 'expense',
      description: 'Dinner at Italian Restaurant',
      amount: 85.60,
      date: new Date('2024-12-10T19:30:00'),
      user: 'John Doe',
      group: 'Friends'
    },
    {
      id: '2',
      type: 'payment',
      description: 'Payment received from Sarah',
      amount: 42.15,
      date: new Date('2024-12-09T14:20:00'),
      user: 'Sarah Wilson'
    },
    {
      id: '3',
      type: 'expense',
      description: 'Groceries at Whole Foods',
      amount: 67.89,
      date: new Date('2024-12-08T11:15:00'),
      user: 'Mike Johnson',
      group: 'Roommates'
    },
    {
      id: '4',
      type: 'group',
      description: 'Added to Weekend Trip group',
      date: new Date('2024-12-07T16:45:00'),
      user: 'Emma Davis'
    }
  ];

  recentExpenses = [
    {
      id: 1,
      description: 'Dinner at Italian Restaurant',
      amount: 85.60,
      group: 'Friends',
      date: new Date('2024-12-10'),
      paidBy: 'You',
      participants: ['John', 'Sarah', 'Mike']
    },
    {
      id: 2,
      description: 'Uber to Airport',
      amount: 42.15,
      group: 'Trip to Paris',
      date: new Date('2024-12-09'),
      paidBy: 'Sarah',
      participants: ['You', 'Sarah']
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.summaryData.totalBalance = this.summaryData.youAreOwed - this.summaryData.youOwe;
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  getBalanceColor(balance: number): string {
    if (balance > 0) return 'positive';
    if (balance < 0) return 'negative';
    return 'neutral';
  }

  getBalanceClass(type: string): string {
    const balance = this.balances.find(b => b.type === type);
    if (!balance) return '';
    
    switch (type) {
      case 'owed': return 'positive';
      case 'owes': return 'negative';
      case 'net': return balance.amount >= 0 ? 'positive' : 'negative';
      default: return '';
    }
  }

  getBalanceIcon(type: string): string {
    switch (type) {
      case 'owed': return 'trending_up';
      case 'owes': return 'trending_down';
      case 'net': return 'account_balance';
      default: return 'account_balance_wallet';
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'expense': return 'receipt_long';
      case 'payment': return 'payments';
      case 'group': return 'group_add';
      default: return 'info';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Updated method names to match template
  addExpense(): void {
    this.router.navigate(['/dashboard/expenses']);
  }

  createGroup(): void {
    this.router.navigate(['/dashboard/groups']);
  }

  addFriend(): void {
    this.router.navigate(['/dashboard/contacts']);
  }

  settleUp(): void {
    this.router.navigate(['/dashboard/groups']);
  }

  viewAllActivities(): void {
    this.router.navigate(['/dashboard/activities']);
  }

  // Keep existing method names for backward compatibility
  navigateToAddExpense(): void {
    this.addExpense();
  }

  navigateToCreateGroup(): void {
    this.createGroup();
  }

  navigateToAddFriend(): void {
    this.addFriend();
  }

  navigateToSettleUp(): void {
    this.settleUp();
  }
}
