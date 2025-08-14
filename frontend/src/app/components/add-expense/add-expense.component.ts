import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
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
  loading = false;

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

  // Split type options for PrimeNG dropdown
  splitTypeOptions = [
    { label: 'Equal Split', value: SplitType.EQUAL },
    { label: 'Percentage Split', value: SplitType.PERCENTAGE },
    { label: 'Custom Split', value: SplitType.CUSTOM }
  ];

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

    // Update validation when amount changes (for custom split validation)
    this.expenseForm.get('amount')?.valueChanges.subscribe(() => {
      if (this.selectedSplitType === SplitType.CUSTOM) {
        const sharesArray = this.expenseForm.get('shares') as FormArray;
        sharesArray.updateValueAndValidity();
      }
    });
  }

  private updateSharesForm(): void {
    const sharesArray = this.expenseForm.get('shares') as FormArray;
    sharesArray.clear();

    if (this.selectedSplitType === SplitType.EQUAL) {
      // Equal split - no need for custom shares
      return;
    }

    // Get members from the selected group
    const members = this.selectedGroup.members || [];

          // Add form controls for each group member (excluding the person who paid)
      members.forEach(member => {
        if (member.id !== this.currentUser.id) {
          const shareGroup = this.fb.group({
            userId: [member.id, Validators.required],
            amount: ['', Validators.required],
            percentage: ['']
          });
          sharesArray.push(shareGroup);
        }
      });

    // Add validation for the shares array
    if (this.selectedSplitType === SplitType.PERCENTAGE) {
      sharesArray.setValidators([this.validatePercentageSplit()]);
    } else if (this.selectedSplitType === SplitType.CUSTOM) {
      sharesArray.setValidators([this.validateCustomSplit()]);
    }
    
    sharesArray.updateValueAndValidity();
  }

  get sharesArray(): FormArray {
    return this.expenseForm.get('shares') as FormArray;
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      this.loading = true;
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
          this.loading = false;
          this.snackBar.open('Expense added successfully!', 'Close', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(expense);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error creating expense:', error);
          this.snackBar.open('Failed to add expense. Please try again.', 'Close', { 
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

  // Custom validator for percentage split (must total 100%)
  private validatePercentageSplit() {
    return (control: AbstractControl) => {
      const formArray = control as FormArray;
      const total = formArray.controls.reduce((sum, control) => {
        const percentage = control.get('percentage')?.value;
        return sum + (percentage ? parseFloat(percentage) : 0);
      }, 0);
      
      return Math.abs(total - 100) < 0.01 ? null : { invalidPercentageSplit: true };
    };
  }

  // Custom validator for custom split (must total expense amount)
  private validateCustomSplit() {
    return (control: AbstractControl) => {
      const formArray = control as FormArray;
      const expenseAmount = this.expenseForm.get('amount')?.value;
      if (!expenseAmount) return null;
      
      const total = formArray.controls.reduce((sum, control) => {
        const amount = control.get('amount')?.value;
        return sum + (amount ? parseFloat(amount) : 0);
      }, 0);
      
      return Math.abs(total - expenseAmount) < 0.01 ? null : { invalidCustomSplit: true };
    };
  }

  // Get validation error message for shares
  getSharesErrorMessage(): string {
    const sharesArray = this.expenseForm.get('shares') as FormArray;
    
    if (sharesArray.hasError('invalidPercentageSplit')) {
      return 'Percentage split must total 100%';
    }
    
    if (sharesArray.hasError('invalidCustomSplit')) {
      return 'Custom split amounts must total the expense amount';
    }
    
    return '';
  }

  // Calculate total percentage for percentage split
  getTotalPercentage(): number {
    const sharesArray = this.expenseForm.get('shares') as FormArray;
    return sharesArray.controls.reduce((sum, control) => {
      const percentage = control.get('percentage')?.value;
      return sum + (percentage ? parseFloat(percentage) : 0);
    }, 0);
  }

  // Calculate total amount for custom split
  getTotalCustomAmount(): number {
    const sharesArray = this.expenseForm.get('shares') as FormArray;
    return sharesArray.controls.reduce((sum, control) => {
      const amount = control.get('amount')?.value;
      return sum + (amount ? parseFloat(amount) : 0);
    }, 0);
  }
}
