import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

// Temporary interfaces until we connect to the real service
interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  phone?: string;
  defaultCurrency: string;
  timezone: string;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  expenseNotifications: boolean;
  settlementNotifications: boolean;
  isActive: boolean;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  initials: string;
  displayName: string;
  fullName: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  userProfile: UserProfile | null = null;
  loading = false;
  editing = false;

  // Available options
  currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'CHF'];
  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' }
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: [''],
      defaultCurrency: ['USD', Validators.required],
      timezone: ['UTC', Validators.required],
      language: ['en', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    
    // Mock data for now - replace with actual service call later
    setTimeout(() => {
      this.userProfile = {
        id: 1,
        username: 'dhruvpatel',
        email: 'dhruv@example.com',
        firstName: 'Dhruv',
        lastName: 'Patel',
        avatarUrl: undefined,
        phone: '+1234567890',
        defaultCurrency: 'USD',
        timezone: 'UTC',
        language: 'en',
        emailNotifications: true,
        pushNotifications: true,
        expenseNotifications: true,
        settlementNotifications: true,
        isActive: true,
        isVerified: true,
        twoFactorEnabled: false,
        lastLogin: '2025-08-15T16:00:00Z',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-08-15T16:00:00Z',
        initials: 'DP',
        displayName: 'Dhruv Patel',
        fullName: 'Dhruv Patel'
      };
      
      if (this.userProfile) {
        this.populateForm(this.userProfile);
      }
      this.loading = false;
    }, 1000);
  }

  populateForm(profile: UserProfile): void {
    this.profileForm.patchValue({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone || '',
      defaultCurrency: profile.defaultCurrency,
      timezone: profile.timezone,
      language: profile.language
    });
  }

  toggleEdit(): void {
    this.editing = !this.editing;
    if (!this.editing && this.userProfile) {
      // Reset form if canceling edit
      this.populateForm(this.userProfile);
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.loading = true;
      
      // Mock update - replace with actual service call later
      setTimeout(() => {
        const formData = this.profileForm.value;
        if (this.userProfile) {
          this.userProfile.firstName = formData.firstName;
          this.userProfile.lastName = formData.lastName;
          this.userProfile.phone = formData.phone;
          this.userProfile.defaultCurrency = formData.defaultCurrency;
          this.userProfile.language = formData.language;
          this.userProfile.fullName = `${formData.firstName} ${formData.lastName}`;
        }
        
        this.editing = false;
        this.loading = false;
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }
}