import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { Group, GroupDto } from '../../models/group.model';
import { User } from '../../models/user.model';
import { AddGroupComponent } from '../add-group/add-group.component';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  groups: Group[] = [];
  currentUser: User | null = null;
  loading = false;

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadGroups();
  }

  loadGroups(): void {
    if (!this.currentUser) return;
    
    this.loading = true;
    this.groupService.getGroupsByUserId(this.currentUser.id!)
      .subscribe({
        next: (groups) => {
          this.groups = groups;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading groups:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error loading groups',
            life: 3000
          });
          this.loading = false;
        }
      });
  }

  openAddGroupDialog(): void {
    const dialogRef = this.dialogService.open(AddGroupComponent, {
      header: 'Create New Group',
      width: '500px',
      data: { currentUser: this.currentUser }
    });

    dialogRef.onClose.subscribe((result: any) => {
      if (result) {
        this.loadGroups();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Group created successfully!',
          life: 3000
        });
      }
    });
  }

  deleteGroup(groupId: number): void {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) return;

    const dialogData: ConfirmationDialogData = {
      title: 'Delete Group',
      message: `Are you sure you want to delete "${group.name}"? This action cannot be undone and will also delete all associated expenses.`,
      confirmText: 'Delete Group',
      cancelText: 'Cancel',
      type: 'danger'
    };

    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: 'Confirm Deletion',
      width: '500px',
      data: dialogData
    });

    dialogRef.onClose.subscribe((result: any) => {
      if (result) {
        this.groupService.deleteGroup(groupId).subscribe({
          next: () => {
            this.loadGroups();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Group deleted successfully!',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error deleting group:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete group. Please try again.',
              life: 4000
            });
          }
        });
      }
    });
  }

  getMemberCount(group: Group): number {
    return group.members ? group.members.length : 0;
  }

  getExpenseCount(group: Group): number {
    return group.expenses ? group.expenses.length : 0;
  }
}
