import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpenseService } from '../../services/expense.service';
import { ExpenseDto, ExpenseShareDto, SplitType } from '../../models/expense.model';
import { Group } from '../../models/group.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent implements OnInit {
  expenseForm!: FormGroup;
  currentUser: User;
  selectedGroup: Group;
  splitTypes = Object.values(SplitType);
  selectedSplitType: SplitType = SplitType.EQUAL;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private dialogRef: MatDialogRef<AddExpenseComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { currentUser: User; selectedGroup: Group }
  ) {
    this.currentUser = data.currentUser;
    this.selectedGroup = data.selectedGroup;
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.expenseForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(200)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      splitType: [SplitType.EQUAL, Validators.required],
      shares: this.fb.array([])
    });

    this.expenseForm.get('splitType')?.valueChanges.subscribe(splitType => {
      this.selectedSplitType = splitType;
      this.updateSharesForm();
    });
  }

  private updateSharesForm(): void {
    const sharesArray = this.expenseForm.get('shares') as FormArray;
    sharesArray.clear();

    if (this.selectedSplitType === SplitType.EQUAL) {
      // Equal split - no need for custom shares
      return;
    }

    // Add form controls for each group member
    this.selectedGroup.members?.forEach(member => {
      if (member.id !== this.currentUser.id) {
        const shareGroup = this.fb.group({
          userId: [member.id, Validators.required],
          amount: ['', Validators.required],
          percentage: ['']
        });
        sharesArray.push(shareGroup);
      }
    });
  }

  get sharesArray(): FormArray {
    return this.expenseForm.get('shares') as FormArray;
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      const formValue = this.expenseForm.value;
      const expenseDto: ExpenseDto = {
        description: formValue.description,
        amount: formValue.amount,
        paidById: this.currentUser.id!,
        groupId: this.selectedGroup.id!,
        splitType: formValue.splitType,
        shares: formValue.shares
      };

      this.expenseService.createExpense(expenseDto).subscribe({
        next: (expense) => {
          this.dialogRef.close(expense);
        },
        error: (error) => {
          console.error('Error creating expense:', error);
          this.snackBar.open('Error creating expense', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const field = this.expenseForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('min')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be greater than 0`;
    }
    if (field?.hasError('maxlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed ${field.errors?.['maxlength'].requiredLength} characters`;
    }
    return '';
  }

  getMemberName(userId: number): string {
    const member = this.selectedGroup.members?.find(m => m.id === userId);
    return member ? `${member.firstName} ${member.lastName}` : '';
  }
}
