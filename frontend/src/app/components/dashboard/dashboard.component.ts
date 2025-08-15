import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  selectedTab = 'groups';
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
    
    // Load saved theme preference
    this.loadThemePreference();
  }

  onTabChange(tab: string): void {
    this.selectedTab = tab;
  }

  logout(): void {
    this.authService.logout();
    this.snackBar.open('Logged out successfully', 'Close', { duration: 3000 });
    this.router.navigate(['/login']);
  }

  getGroupCount(): number {
    // This will be enhanced later to get actual counts
    return 0;
  }

  getExpenseCount(): number {
    // This will be enhanced later to get actual counts
    return 0;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    this.saveThemePreference();
    
    const themeName = this.isDarkMode ? 'Dark' : 'Light';
    this.snackBar.open(`Switched to ${themeName} mode`, 'Close', { duration: 3000 });
  }

  private applyTheme(): void {
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }

  private loadThemePreference(): void {
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
      this.applyTheme();
    }
  }

  private saveThemePreference(): void {
    localStorage.setItem('theme-preference', this.isDarkMode ? 'dark' : 'light');
  }
}