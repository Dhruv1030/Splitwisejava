import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Contact {
  id: number;
  userId: number;
  contactUserId?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED';
  relationshipType: 'FRIEND' | 'FAMILY' | 'COLLEAGUE' | 'OTHER';
  isBlocked: boolean;
  addedAt: string;
  updatedAt: string;
}

export interface AddContactRequest {
  email?: string;
  contactUserId?: number;
  contactName?: string;
  contactPhone?: string;
  relationshipType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private apiUrl = `${environment.apiUrl}/contacts`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get all contacts for current user
  getAllContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Get friends (accepted contacts)
  getFriends(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/friends`, { headers: this.getHeaders() });
  }

  // Get friends count
  getFriendsCount(): Observable<{count: number}> {
    return this.http.get<{count: number}>(`${this.apiUrl}/friends/count`, { headers: this.getHeaders() });
  }

  // Get blocked contacts
  getBlockedContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/blocked`, { headers: this.getHeaders() });
  }

  // Get pending invitations sent
  getPendingSent(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/pending-sent`, { headers: this.getHeaders() });
  }

  // Get pending invitations received
  getPendingReceived(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/pending-received`, { headers: this.getHeaders() });
  }

  // Add contact by email
  addContactByEmail(email: string, relationshipType: string = 'FRIEND'): Observable<Contact> {
    return this.http.post<Contact>(
      `${this.apiUrl}/add-email`, 
      { email, relationshipType }, 
      { headers: this.getHeaders() }
    );
  }

  // Add contact by user ID
  addContactByUserId(contactUserId: number, relationshipType: string = 'FRIEND'): Observable<Contact> {
    return this.http.post<Contact>(
      `${this.apiUrl}/add-user/${contactUserId}`, 
      { relationshipType }, 
      { headers: this.getHeaders() }
    );
  }

  // Accept contact invitation
  acceptInvitation(contactId: number): Observable<Contact> {
    return this.http.post<Contact>(`${this.apiUrl}/${contactId}/accept`, {}, { headers: this.getHeaders() });
  }

  // Decline contact invitation
  declineInvitation(contactId: number): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/${contactId}/decline`, {}, { headers: this.getHeaders() });
  }

  // Block contact
  blockContact(contactId: number): Observable<Contact> {
    return this.http.post<Contact>(`${this.apiUrl}/${contactId}/block`, {}, { headers: this.getHeaders() });
  }

  // Unblock contact
  unblockContact(contactId: number): Observable<Contact> {
    return this.http.post<Contact>(`${this.apiUrl}/${contactId}/unblock`, {}, { headers: this.getHeaders() });
  }

  // Update contact relationship type
  updateRelationshipType(contactId: number, relationshipType: string): Observable<Contact> {
    return this.http.put<Contact>(
      `${this.apiUrl}/${contactId}/relationship`, 
      { relationshipType }, 
      { headers: this.getHeaders() }
    );
  }

  // Remove contact
  removeContact(contactId: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/${contactId}`, { headers: this.getHeaders() });
  }

  // Search contacts
  searchContacts(query: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/search?q=${query}`, { headers: this.getHeaders() });
  }
}