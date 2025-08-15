import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  phone?: string;
  defaultCurrency: string;
  timezone: string;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  expenseNotifications: boolean;
  settlementNotifications: boolean;
  isActive: boolean;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  initials: string;
  displayName: string;
  fullName: string;
}

export interface UserStats {
  userId: number;
  username: string;
  memberSince: string;
  lastLogin?: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  expenseNotifications: boolean;
  settlementNotifications: boolean;
}

export interface AccountSettings {
  defaultCurrency: string;
  timezone: string;
  language: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get current user's profile
  getCurrentUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Update user profile
  updateProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.apiUrl, profile, { headers: this.getHeaders() });
  }

  // Update avatar
  updateAvatar(avatarUrl: string): Observable<{message: string, avatarUrl: string}> {
    return this.http.put<{message: string, avatarUrl: string}>(
      `${this.apiUrl}/avatar`, 
      { avatarUrl }, 
      { headers: this.getHeaders() }
    );
  }

  // Update notification preferences
  updateNotificationPreferences(preferences: NotificationPreferences): Observable<UserProfile> {
    return this.http.put<UserProfile>(
      `${this.apiUrl}/notifications`, 
      preferences, 
      { headers: this.getHeaders() }
    );
  }

  // Update account settings
  updateAccountSettings(settings: AccountSettings): Observable<UserProfile> {
    return this.http.put<UserProfile>(
      `${this.apiUrl}/settings`, 
      settings, 
      { headers: this.getHeaders() }
    );
  }

  // Get public user profile
  getUserProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`, { headers: this.getHeaders() });
  }

  // Update last login
  updateLastLogin(): Observable<{message: string}> {
    return this.http.post<{message: string}>(
      `${this.apiUrl}/last-login`, 
      {}, 
      { headers: this.getHeaders() }
    );
  }

  // Get user statistics
  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/stats`, { headers: this.getHeaders() });
  }

  // Deactivate account
  deactivateAccount(): Observable<{message: string}> {
    return this.http.delete<{message: string}>(this.apiUrl, { headers: this.getHeaders() });
  }
}