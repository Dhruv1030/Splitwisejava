import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, map, of } from 'rxjs';
import { ExpenseService } from './expense.service';
import { GroupService } from './group.service';
import { AuthService } from './auth.service';
import { Expense } from '../models/expense.model';
import { Group } from '../models/group.model';
import { environment } from '../../environments/environment';

export interface ActivityItem {
  id: string;
  type: 'expense' | 'payment' | 'group' | 'friend';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  amount?: number;
  icon: string;
  group?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = `${environment.apiUrl}/activities`;

  constructor(
    private http: HttpClient,
    private expenseService: ExpenseService,
    private groupService: GroupService,
    private authService: AuthService
  ) { }

  // Get user's activity feed by combining recent expenses and groups
  getUserActivities(): Observable<ActivityItem[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of([]);
    }

    return combineLatest([
      this.expenseService.getAllExpenses(),
      this.groupService.getUserGroups()
    ]).pipe(
      map(([expenses, groups]) => {
        const activities: ActivityItem[] = [];

        // Convert recent expenses to activity items
        expenses
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 10) // Get last 10 expenses
          .forEach(expense => {
            const group = expense.group || groups.find(g => g.id === expense.group?.id);
            const paidByUser = expense.paidBy?.firstName + ' ' + expense.paidBy?.lastName || 'Unknown';
            
            activities.push({
              id: `expense-${expense.id}`,
              type: 'expense',
              title: 'New expense added',
              description: `${paidByUser} added "${expense.description}"${group ? ` in ${group.name}` : ''}`,
              timestamp: new Date(expense.createdAt || Date.now()),
              user: paidByUser,
              amount: expense.amount,
              icon: this.getExpenseIcon(expense.description),
              group: group?.name
            });
          });

        // Convert recent groups to activity items
        groups
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 5) // Get last 5 groups
          .forEach(group => {
            const createdByUser = group.createdBy?.firstName + ' ' + group.createdBy?.lastName || 'Unknown';
            
            activities.push({
              id: `group-${group.id}`,
              type: 'group',
              title: 'New group created',
              description: `${createdByUser === currentUser.firstName + ' ' + currentUser.lastName ? 'You' : createdByUser} created "${group.name}" group`,
              timestamp: new Date(group.createdAt || Date.now()),
              user: createdByUser === currentUser.firstName + ' ' + currentUser.lastName ? 'You' : createdByUser,
              icon: this.getGroupIcon(group.name),
              group: group.name
            });
          });

        // Sort all activities by timestamp (most recent first)
        return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      })
    );
  }

  // Get notifications/activities from backend API (if available)
  getNotifications(): Observable<ActivityItem[]> {
    return this.http.get<ActivityItem[]>(`${this.apiUrl}/notifications`);
  }

  // Mark notification as read
  markAsRead(activityId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${activityId}/read`, {});
  }

  private getExpenseIcon(description: string): string {
    const desc = description.toLowerCase();
    if (desc.includes('food') || desc.includes('restaurant') || desc.includes('dinner') || desc.includes('lunch')) {
      return '🍽️';
    } else if (desc.includes('grocery') || desc.includes('shopping')) {
      return '🛒';
    } else if (desc.includes('gas') || desc.includes('fuel') || desc.includes('uber') || desc.includes('taxi')) {
      return '🚗';
    } else if (desc.includes('movie') || desc.includes('entertainment') || desc.includes('game')) {
      return '🎬';
    } else if (desc.includes('hotel') || desc.includes('accommodation') || desc.includes('airbnb')) {
      return '🏨';
    } else if (desc.includes('flight') || desc.includes('airplane') || desc.includes('airline')) {
      return '✈️';
    } else if (desc.includes('coffee') || desc.includes('drink') || desc.includes('beer') || desc.includes('bar')) {
      return '☕';
    } else if (desc.includes('rent') || desc.includes('utilities') || desc.includes('electricity')) {
      return '🏠';
    }
    return '💳';
  }

  private getGroupIcon(groupName: string): string {
    const name = groupName.toLowerCase();
    if (name.includes('trip') || name.includes('vacation') || name.includes('travel')) {
      return '🧳';
    } else if (name.includes('house') || name.includes('home') || name.includes('roommate')) {
      return '🏠';
    } else if (name.includes('work') || name.includes('office') || name.includes('team')) {
      return '💼';
    } else if (name.includes('friends') || name.includes('party') || name.includes('celebration')) {
      return '🎉';
    } else if (name.includes('family')) {
      return '👨‍👩‍👧‍👦';
    }
    return '👥';
  }
}
