import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FakeAuthService } from '../services/fake-auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  
  constructor(private authService: FakeAuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    if (!this.authService.isLoggedIn()) {
      // User is not logged in, allow access to guest-only routes
      return true;
    }
    
    // User is logged in, redirect to dashboard
    this.router.navigate(['/dashboard']);
    return false;
  }
}
