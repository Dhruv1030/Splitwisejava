import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { Group, GroupDto } from '../../models/group.model';
import { User } from '../../models/user.model';
import { AddGroupComponent } from '../add-group/add-group.component';

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
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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
          this.snackBar.open('Error loading groups', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
  }

  openAddGroupDialog(): void {
    const dialogRef = this.dialog.open(AddGroupComponent, {
      width: '500px',
      data: { currentUser: this.currentUser }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGroups();
        this.snackBar.open('Group created successfully!', 'Close', { duration: 3000 });
      }
    });
  }

  deleteGroup(groupId: number): void {
    if (confirm('Are you sure you want to delete this group?')) {
      this.groupService.deleteGroup(groupId).subscribe({
        next: () => {
          this.loadGroups();
          this.snackBar.open('Group deleted successfully!', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting group:', error);
          this.snackBar.open('Error deleting group', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getMemberCount(group: Group): number {
    return group.members ? group.members.length : 0;
  }

  getExpenseCount(group: Group): number {
    return group.expenses ? group.expenses.length : 0;
  }
}
