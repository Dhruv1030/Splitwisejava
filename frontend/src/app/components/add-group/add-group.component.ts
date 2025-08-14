import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupService } from '../../services/group.service';
import { GroupDto } from '../../models/group.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {
  groupForm!: FormGroup;
  currentUser: User;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private dialogRef: MatDialogRef<AddGroupComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { currentUser: User }
  ) {
    this.currentUser = data.currentUser;
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      this.loading = true;
      const groupDto: GroupDto = {
        ...this.groupForm.value,
        createdById: this.currentUser.id!
      };

      this.groupService.createGroup(groupDto).subscribe({
        next: (group) => {
          this.loading = false;
          this.snackBar.open('Group created successfully!', 'Close', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(group);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error creating group:', error);
          this.snackBar.open('Failed to create group. Please try again.', 'Close', { 
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const field = this.groupForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    if (field?.hasError('maxlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed ${field.errors?.['maxlength'].requiredLength} characters`;
    }
    return '';
  }
}
