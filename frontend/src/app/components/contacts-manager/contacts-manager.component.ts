import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactsService, Contact } from '../../services/contacts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

interface ContactTab {
  label: string;
  count: number;
  contacts: Contact[];
}

@Component({
  selector: 'app-contacts-manager',
  templateUrl: './contacts-manager.component.html',
  styleUrls: ['./contacts-manager.component.scss']
})
export class ContactsManagerComponent implements OnInit {
  addContactForm: FormGroup;
  searchForm: FormGroup;
  
  loading = false;
  selectedTabIndex = 0;
  
  tabs: ContactTab[] = [
    { label: 'All Contacts', count: 0, contacts: [] },
    { label: 'Friends', count: 0, contacts: [] },
    { label: 'Pending Sent', count: 0, contacts: [] },
    { label: 'Pending Received', count: 0, contacts: [] },
    { label: 'Blocked', count: 0, contacts: [] }
  ];

  relationshipTypes = [
    { value: 'FRIEND', label: 'Friend' },
    { value: 'FAMILY', label: 'Family' },
    { value: 'COLLEAGUE', label: 'Colleague' },
    { value: 'OTHER', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private contactsService: ContactsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.addContactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      relationshipType: ['FRIEND', Validators.required]
    });

    this.searchForm = this.fb.group({
      query: ['']
    });
  }

  ngOnInit(): void {
    this.loadAllContacts();
  }

  loadAllContacts(): void {
    this.loading = true;

    // Load all contact types
    Promise.all([
      this.contactsService.getAllContacts().toPromise(),
      this.contactsService.getFriends().toPromise(),
      this.contactsService.getPendingSent().toPromise(),
      this.contactsService.getPendingReceived().toPromise(),
      this.contactsService.getBlockedContacts().toPromise()
    ]).then(([allContacts, friends, pendingSent, pendingReceived, blocked]) => {
      this.tabs[0] = { label: 'All Contacts', count: allContacts?.length || 0, contacts: allContacts || [] };
      this.tabs[1] = { label: 'Friends', count: friends?.length || 0, contacts: friends || [] };
      this.tabs[2] = { label: 'Pending Sent', count: pendingSent?.length || 0, contacts: pendingSent || [] };
      this.tabs[3] = { label: 'Pending Received', count: pendingReceived?.length || 0, contacts: pendingReceived || [] };
      this.tabs[4] = { label: 'Blocked', count: blocked?.length || 0, contacts: blocked || [] };
      
      this.loading = false;
    }).catch(error => {
      console.error('Error loading contacts:', error);
      this.snackBar.open('Error loading contacts', 'Close', { duration: 3000 });
      this.loading = false;
    });
  }

  onAddContact(): void {
    if (this.addContactForm.valid) {
      const { email, relationshipType } = this.addContactForm.value;
      
      this.contactsService.addContactByEmail(email, relationshipType).subscribe({
        next: (contact) => {
          this.addContactForm.reset({ relationshipType: 'FRIEND' });
          this.loadAllContacts();
          this.snackBar.open('Contact invitation sent!', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error adding contact:', error);
          this.snackBar.open('Error adding contact', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onSearchContacts(): void {
    const query = this.searchForm.get('query')?.value;
    if (query && query.trim()) {
      this.contactsService.searchContacts(query).subscribe({
        next: (contacts) => {
          // Update the current tab with search results
          this.tabs[this.selectedTabIndex].contacts = contacts;
        },
        error: (error) => {
          console.error('Error searching contacts:', error);
          this.snackBar.open('Error searching contacts', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.loadAllContacts();
    }
  }

  onAcceptInvitation(contact: Contact): void {
    this.contactsService.acceptInvitation(contact.id).subscribe({
      next: () => {
        this.loadAllContacts();
        this.snackBar.open('Contact invitation accepted!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error accepting invitation:', error);
        this.snackBar.open('Error accepting invitation', 'Close', { duration: 3000 });
      }
    });
  }

  onDeclineInvitation(contact: Contact): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Decline Invitation',
        message: `Are you sure you want to decline the invitation from ${this.getContactDisplayName(contact)}?`,
        confirmText: 'Decline',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactsService.declineInvitation(contact.id).subscribe({
          next: () => {
            this.loadAllContacts();
            this.snackBar.open('Contact invitation declined', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error declining invitation:', error);
            this.snackBar.open('Error declining invitation', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  onBlockContact(contact: Contact): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Block Contact',
        message: `Are you sure you want to block ${this.getContactDisplayName(contact)}?`,
        confirmText: 'Block',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactsService.blockContact(contact.id).subscribe({
          next: () => {
            this.loadAllContacts();
            this.snackBar.open('Contact blocked', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error blocking contact:', error);
            this.snackBar.open('Error blocking contact', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  onUnblockContact(contact: Contact): void {
    this.contactsService.unblockContact(contact.id).subscribe({
      next: () => {
        this.loadAllContacts();
        this.snackBar.open('Contact unblocked', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error unblocking contact:', error);
        this.snackBar.open('Error unblocking contact', 'Close', { duration: 3000 });
      }
    });
  }

  onRemoveContact(contact: Contact): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Remove Contact',
        message: `Are you sure you want to remove ${this.getContactDisplayName(contact)} from your contacts?`,
        confirmText: 'Remove',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactsService.removeContact(contact.id).subscribe({
          next: () => {
            this.loadAllContacts();
            this.snackBar.open('Contact removed', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error removing contact:', error);
            this.snackBar.open('Error removing contact', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  onUpdateRelationship(contact: Contact, newType: string): void {
    this.contactsService.updateRelationshipType(contact.id, newType).subscribe({
      next: () => {
        this.loadAllContacts();
        this.snackBar.open('Relationship updated', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating relationship:', error);
        this.snackBar.open('Error updating relationship', 'Close', { duration: 3000 });
      }
    });
  }

  getContactDisplayName(contact: Contact): string {
    if (contact.contactName) {
      return contact.contactName;
    }
    if (contact.contactEmail) {
      return contact.contactEmail;
    }
    return `Contact #${contact.id}`;
  }

  getContactAvatar(contact: Contact): string {
    const name = this.getContactDisplayName(contact);
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    return `https://via.placeholder.com/40?text=${initials}`;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACCEPTED': return 'primary';
      case 'PENDING': return 'accent';
      case 'DECLINED': return 'warn';
      case 'BLOCKED': return 'warn';
      default: return 'primary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'ACCEPTED': return 'check_circle';
      case 'PENDING': return 'schedule';
      case 'DECLINED': return 'cancel';
      case 'BLOCKED': return 'block';
      default: return 'help';
    }
  }

  getRelationshipIcon(type: string): string {
    switch (type) {
      case 'FRIEND': return 'person';
      case 'FAMILY': return 'family_restroom';
      case 'COLLEAGUE': return 'work';
      case 'OTHER': return 'group';
      default: return 'person';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    this.searchForm.reset();
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.loadAllContacts();
  }
}