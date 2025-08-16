import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MockApiService } from '../services/mock-api.service';

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {

  constructor(private mockApiService: MockApiService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only intercept API requests
    if (!request.url.startsWith('/api/')) {
      return next.handle(request);
    }

    // Handle authentication endpoints
    if (request.url === '/api/auth/login' && request.method === 'POST') {
      return this.handleLoginRequest(request);
    }
    
    if (request.url === '/api/auth/register' && request.method === 'POST') {
      return this.handleRegisterRequest(request);
    }

    // Handle groups endpoints
    if (request.url === '/api/groups' && request.method === 'GET') {
      return this.handleGetGroupsRequest();
    }

    if (request.url === '/api/groups' && request.method === 'POST') {
      return this.handleCreateGroupRequest(request);
    }

    // Handle expenses endpoints
    if (request.url.match(/^\/api\/groups\/[^\/]+\/expenses$/) && request.method === 'GET') {
      const groupId = this.extractGroupId(request.url);
      return this.handleGetGroupExpensesRequest(groupId);
    }

    if (request.url === '/api/expenses' && request.method === 'POST') {
      return this.handleCreateExpenseRequest(request);
    }

    // If we don't have a mock for this endpoint, pass it through
    return next.handle(request);
  }

  private handleLoginRequest(request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    const response = this.mockApiService.login(request.body as any);
    return this.createObservable(response);
  }

  private handleRegisterRequest(request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    const response = this.mockApiService.register(request.body as any);
    return this.createObservable(response);
  }

  private handleGetGroupsRequest(): Observable<HttpEvent<unknown>> {
    const response = this.mockApiService.getGroups();
    return this.createObservable(response);
  }

  private handleCreateGroupRequest(request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    const response = this.mockApiService.createGroup(request.body as any);
    return this.createObservable(response);
  }

  private handleGetGroupExpensesRequest(groupId: string): Observable<HttpEvent<unknown>> {
    const response = this.mockApiService.getGroupExpenses(groupId);
    return this.createObservable(response);
  }

  private handleCreateExpenseRequest(request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    const response = this.mockApiService.createExpense(request.body as any);
    return this.createObservable(response);
  }

  private extractGroupId(url: string): string {
    const match = url.match(/^\/api\/groups\/([^\/]+)\/expenses$/);
    if (!match) {
      throw new Error('Invalid URL format');
    }
    return match[1];
  }

  private createObservable(response: Observable<any>): Observable<HttpEvent<unknown>> {
    return new Observable(observer => {
      response.subscribe({
        next: (data) => {
          observer.next(new HttpResponse({ body: data, status: 200 }));
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
}
