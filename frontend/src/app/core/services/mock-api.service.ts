import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth.model';
import { CreateExpenseRequest, Expense } from '../models/expense.model';
import { CreateGroupRequest, Group } from '../models/group.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  private readonly STORAGE_KEY = 'splitwise_clone_mock_data';
  private readonly DELAY_MS = 500;

  private users: User[] = [];
  private groups: Group[] = [];
  private expenses: Expense[] = [];
  private tokens: Map<string, string> = new Map(); // userId -> token

  constructor() {
    this.loadData();
    if (this.users.length === 0) {
      this.initializeDefaultData();
    }
  }

  login(request: LoginRequest): Observable<AuthResponse | null> {
    const user = this.users.find(u => u.email === request.email);

    if (!user) {
      return throwError(() => new Error('Invalid email or password'));
    }

    // In a real application, we'd verify the password here
    // For mocking purposes, we'll just assume it's correct
    const token = this.generateToken();
    this.tokens.set(user.id, token);
    
    const response: AuthResponse = {
      user,
      token
    };

    return of(response).pipe(delay(this.DELAY_MS));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    // Check if email is already in use
    const existingUser = this.users.find(u => u.email === request.email);
    if (existingUser) {
      return throwError(() => new Error('Email already in use'));
    }

    // Create new user
    const newUser: User = {
      id: uuidv4(),
      username: request.username,
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName
    };

    this.users.push(newUser);

    // Generate token
    const token = this.generateToken();
    this.tokens.set(newUser.id, token);

    // Save data
    this.saveData();
    
    const response: AuthResponse = {
      user: newUser,
      token
    };

    return of(response).pipe(delay(this.DELAY_MS));
  }

  getGroups(): Observable<Group[]> {
    return of([...this.groups]).pipe(delay(this.DELAY_MS));
  }

  createGroup(request: CreateGroupRequest): Observable<Group> {
    const newGroup: Group = {
      id: uuidv4(),
      name: request.name,
      description: request.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: request.type,
      isPrivate: request.isPrivate,
      members: []
    };

    this.groups.push(newGroup);
    this.saveData();

    return of(newGroup).pipe(delay(this.DELAY_MS));
  }

  getGroupExpenses(groupId: string): Observable<Expense[]> {
    const groupExpenses = this.expenses.filter(e => e.group?.id === groupId);
    return of([...groupExpenses]).pipe(delay(this.DELAY_MS));
  }

  createExpense(request: CreateExpenseRequest): Observable<Expense> {
    const payer = this.users.find(u => u.id === request.paidById);
    if (!payer) {
      return throwError(() => new Error('Payer not found'));
    }

    let group: Group | undefined;
    if (request.groupId) {
      group = this.groups.find(g => g.id === request.groupId);
      if (!group) {
        return throwError(() => new Error('Group not found'));
      }
    }

    const shares = request.shares.map(share => {
      const user = this.users.find(u => u.id === share.userId);
      if (!user) {
        throw new Error(`User with ID ${share.userId} not found`);
      }
      return {
        user,
        amount: share.amount,
        isPaid: false
      };
    });

    const newExpense: Expense = {
      id: uuidv4(),
      description: request.description,
      amount: request.amount,
      currency: request.currency,
      paidBy: payer,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      group,
      category: request.category,
      shares
    };

    this.expenses.push(newExpense);
    this.saveData();

    return of(newExpense).pipe(delay(this.DELAY_MS));
  }

  private generateToken(): string {
    // In a real app, you'd use a more secure method
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private loadData(): void {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (storedData) {
      const data = JSON.parse(storedData);
      this.users = data.users || [];
      this.groups = data.groups || [];
      this.expenses = data.expenses || [];
      
      // Restore the tokens map
      this.tokens = new Map();
      if (data.tokens) {
        Object.entries(data.tokens).forEach(([userId, token]) => {
          this.tokens.set(userId, token as string);
        });
      }
    }
  }

  private saveData(): void {
    // Convert tokens Map to plain object for storage
    const tokensObj: Record<string, string> = {};
    this.tokens.forEach((token, userId) => {
      tokensObj[userId] = token;
    });

    const data = {
      users: this.users,
      groups: this.groups,
      expenses: this.expenses,
      tokens: tokensObj
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private initializeDefaultData(): void {
    // Create demo users
    const user1: User = {
      id: uuidv4(),
      username: 'johndoe',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      profileImageUrl: 'https://i.pravatar.cc/150?u=john'
    };

    const user2: User = {
      id: uuidv4(),
      username: 'janedoe',
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      profileImageUrl: 'https://i.pravatar.cc/150?u=jane'
    };

    const user3: User = {
      id: uuidv4(),
      username: 'bobsmith',
      email: 'bob@example.com',
      firstName: 'Bob',
      lastName: 'Smith',
      profileImageUrl: 'https://i.pravatar.cc/150?u=bob'
    };

    this.users = [user1, user2, user3];

    // Create demo groups
    const group1: Group = {
      id: uuidv4(),
      name: 'Apartment Expenses',
      description: 'Shared expenses for our apartment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: 'apartment',
      isPrivate: false,
      members: [
        {
          user: user1,
          role: 'admin',
          joinedAt: new Date().toISOString()
        },
        {
          user: user2,
          role: 'member',
          joinedAt: new Date().toISOString()
        }
      ]
    };

    const group2: Group = {
      id: uuidv4(),
      name: 'Weekend Trip',
      description: 'Expenses for our weekend trip',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: 'trip',
      isPrivate: false,
      members: [
        {
          user: user1,
          role: 'admin',
          joinedAt: new Date().toISOString()
        },
        {
          user: user2,
          role: 'member',
          joinedAt: new Date().toISOString()
        },
        {
          user: user3,
          role: 'member',
          joinedAt: new Date().toISOString()
        }
      ]
    };

    this.groups = [group1, group2];

    // Create demo expenses
    const expense1: Expense = {
      id: uuidv4(),
      description: 'Groceries',
      amount: 87.50,
      currency: 'USD',
      paidBy: user1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      group: group1,
      category: 'food',
      shares: [
        {
          user: user1,
          amount: 43.75,
          isPaid: true
        },
        {
          user: user2,
          amount: 43.75,
          isPaid: false
        }
      ]
    };

    const expense2: Expense = {
      id: uuidv4(),
      description: 'Rent - August',
      amount: 1500,
      currency: 'USD',
      paidBy: user2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      group: group1,
      category: 'rent',
      shares: [
        {
          user: user1,
          amount: 750,
          isPaid: false
        },
        {
          user: user2,
          amount: 750,
          isPaid: true
        }
      ]
    };

    const expense3: Expense = {
      id: uuidv4(),
      description: 'Hotel Booking',
      amount: 420,
      currency: 'USD',
      paidBy: user3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      group: group2,
      category: 'travel',
      shares: [
        {
          user: user1,
          amount: 140,
          isPaid: false
        },
        {
          user: user2,
          amount: 140,
          isPaid: false
        },
        {
          user: user3,
          amount: 140,
          isPaid: true
        }
      ]
    };

    this.expenses = [expense1, expense2, expense3];

    // Save initial data
    this.saveData();
  }
}
