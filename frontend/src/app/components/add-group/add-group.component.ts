import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
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
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private messageService: MessageService
  ) {
    this.currentUser = config.data.currentUser;
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });

    // Debug form validation
    this.groupForm.statusChanges.subscribe(status => {
      console.log('Form status:', status);
      console.log('Form valid:', this.groupForm.valid);
      console.log('Name field:', this.groupForm.get('name')?.value, this.groupForm.get('name')?.valid);
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
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Group created successfully!',
            life: 3000
          });
          this.dialogRef.close(group);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error creating group:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create group. Please try again.',
            life: 4000
          });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onFormChange(): void {
    // Trigger change detection for form validation
    this.groupForm.updateValueAndValidity();
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
