import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Contact, ContactInvitation, AddContactRequest } from '../models/contact.model';

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

  // Mock data for development
  private mockContacts: Contact[] = [
    {
      id: 1,
      userId: 1,
      contactId: 2,
      contactName: 'John Doe',
      contactEmail: 'john@example.com',
      relationshipType: 'FRIEND',
      status: 'ACCEPTED',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 2,
      userId: 1,
      contactId: 3,
      contactName: 'Jane Smith',
      contactEmail: 'jane@example.com',
      relationshipType: 'FAMILY',
      status: 'ACCEPTED',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 3,
      userId: 1,
      contactId: 4,
      contactName: 'Bob Wilson',
      contactEmail: 'bob@example.com',
      relationshipType: 'COLLEAGUE',
      status: 'PENDING',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    }
  ];

  private mockInvitations: ContactInvitation[] = [
    {
      id: 1,
      fromUserId: 5,
      toUserId: 1,
      fromUserName: 'Alice Johnson',
      fromUserEmail: 'alice@example.com',
      relationshipType: 'FRIEND',
      status: 'PENDING',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    }
  ];

  getAllContacts(): Observable<Contact[]> {
    // Try backend API first, fallback to mock data
    return this.http.get<Contact[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Backend not available, using mock data:', error);
          return of(this.mockContacts.filter(c => c.status === 'ACCEPTED'));
        })
      );
  }

  getFriends(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/friends`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Backend not available, using mock data:', error);
          return of(this.mockContacts.filter(c => c.relationshipType === 'FRIEND' && c.status === 'ACCEPTED'));
        })
      );
  }

  getBlockedContacts(): Observable<Contact[]> {
    return of(this.mockContacts.filter(c => c.status === 'BLOCKED'));
  }

  getPendingSentInvitations(): Observable<ContactInvitation[]> {
    return of(this.mockInvitations.filter(i => i.status === 'PENDING'));
  }

  getPendingReceivedInvitations(): Observable<ContactInvitation[]> {
    return of(this.mockInvitations.filter(i => i.status === 'PENDING'));
  }

  addContactByEmail(email: string, relationshipType: string): Observable<Contact> {
    const newContact: Contact = {
      id: this.mockContacts.length + 1,
      userId: 1,
      contactId: this.mockContacts.length + 10,
      contactEmail: email,
      relationshipType: relationshipType as any,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.mockContacts.push(newContact);
    return of(newContact);
  }

  addContactByUserId(userId: number, relationshipType: string): Observable<Contact> {
    const newContact: Contact = {
      id: this.mockContacts.length + 1,
      userId: 1,
      contactId: userId,
      relationshipType: relationshipType as any,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.mockContacts.push(newContact);
    return of(newContact);
  }

  acceptContactInvitation(contactId: number): Observable<Contact> {
    const contact = this.mockContacts.find(c => c.id === contactId);
    if (contact) {
      contact.status = 'ACCEPTED';
      contact.updatedAt = new Date().toISOString();
    }
    return of(contact!);
  }

  declineContactInvitation(contactId: number): Observable<any> {
    const contact = this.mockContacts.find(c => c.id === contactId);
    if (contact) {
      contact.status = 'DECLINED';
      contact.updatedAt = new Date().toISOString();
    }
    return of({ message: 'Invitation declined' });
  }

  blockContact(contactId: number): Observable<Contact> {
    const contact = this.mockContacts.find(c => c.id === contactId);
    if (contact) {
      contact.status = 'BLOCKED';
      contact.updatedAt = new Date().toISOString();
    }
    return of(contact!);
  }

  unblockContact(contactId: number): Observable<Contact> {
    const contact = this.mockContacts.find(c => c.id === contactId);
    if (contact) {
      contact.status = 'ACCEPTED';
      contact.updatedAt = new Date().toISOString();
    }
    return of(contact!);
  }

  removeContact(contactId: number): Observable<any> {
    const index = this.mockContacts.findIndex(c => c.id === contactId);
    if (index > -1) {
      this.mockContacts.splice(index, 1);
    }
    return of({ message: 'Contact removed' });
  }

  updateRelationshipType(contactId: number, relationshipType: string): Observable<Contact> {
    const contact = this.mockContacts.find(c => c.id === contactId);
    if (contact) {
      contact.relationshipType = relationshipType as any;
      contact.updatedAt = new Date().toISOString();
    }
    return of(contact!);
  }

  searchContacts(query: string): Observable<Contact[]> {
    const filtered = this.mockContacts.filter(c => 
      c.contactName?.toLowerCase().includes(query.toLowerCase()) ||
      c.contactEmail?.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered);
  }
}