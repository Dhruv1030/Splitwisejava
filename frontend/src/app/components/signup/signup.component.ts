import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const { username, email, password, confirmPassword } = this.signUpForm.value;
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      this.loading = true;
      this.authService.signUp(username, email, password).subscribe({
        next: () => {
          this.loading = false;
          alert('Sign-up successful!');
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          this.loading = false;
          alert('Sign-up failed: ' + err.error.message);
        }
      });
    }
  }
}
