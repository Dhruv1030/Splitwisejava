import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MessageService } from 'primeng/api';

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
    private messageService: MessageService
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
    this.messageService.add({
      severity: 'info',
      summary: 'Theme Changed',
      detail: `Switched to ${themeName} mode`,
      life: 3000
    });
  }

  private applyTheme(): void {
    const themeLink = document.getElementById('theme-link') as HTMLLinkElement;
    if (themeLink) {
      const themeName = this.isDarkMode ? 'lara-dark-blue' : 'lara-light-blue';
      themeLink.href = `primeng/resources/themes/${themeName}/theme.css`;
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
