import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class FakeAuthService {
  private readonly AUTH_STORAGE_KEY = 'splitwise_auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private http: HttpClient) {
    // Try to get user from local storage
    const storedAuth = localStorage.getItem(this.AUTH_STORAGE_KEY);
    let initialUser: User | null = null;

    if (storedAuth) {
      try {
        const auth = JSON.parse(storedAuth);
        initialUser = auth.user;
      } catch (error) {
        console.error('Error parsing stored auth', error);
        localStorage.removeItem(this.AUTH_STORAGE_KEY);
      }
    }

    this.currentUserSubject = new BehaviorSubject<User | null>(initialUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<AuthResponse>('/api/auth/login', credentials)
      .pipe(
        tap(response => this.handleAuth(response)),
        map(response => response.user),
        catchError(error => {
          console.error('Login failed', error);
          return throwError(() => new Error('Invalid email or password'));
        })
      );
  }

  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<AuthResponse>('/api/auth/register', userData)
      .pipe(
        tap(response => this.handleAuth(response)),
        map(response => response.user),
        catchError(error => {
          console.error('Registration failed', error);
          return throwError(() => new Error('Registration failed. Please try again.'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_STORAGE_KEY);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private handleAuth(response: AuthResponse): void {
    // Save auth data to local storage
    localStorage.setItem(this.AUTH_STORAGE_KEY, JSON.stringify(response));
    // Update current user
    this.currentUserSubject.next(response.user);
  }
}
