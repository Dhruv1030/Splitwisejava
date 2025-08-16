import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview-simple.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ContactsManagerComponent } from './components/contacts-manager/contacts-manager.component';
import { NotificationsCenterComponent } from './components/notifications-center/notifications-center.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: DashboardOverviewComponent },
      { path: 'groups', component: GroupListComponent },
      { path: 'expenses', component: ExpenseListComponent },
      { path: 'contacts', component: ContactsManagerComponent },
      { path: 'activity', component: NotificationsCenterComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: 'notifications', component: NotificationsCenterComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }