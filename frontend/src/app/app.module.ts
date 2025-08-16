import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview-simple.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
// import { AddExpenseComponent } from './components/add-expense/add-expense.component';
import { AddExpenseComponent } from './components/add-expense/add-expense-simple.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { ContactsManagerComponent } from './components/contacts-manager/contacts-manager.component';
import { NotificationsCenterComponent } from './components/notifications-center/notifications-center.component';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    DashboardOverviewComponent,
    GroupListComponent,
    ExpenseListComponent,
    AddExpenseComponent,
    ConfirmationDialogComponent,
    UserProfileComponent,
    ProfileSettingsComponent,
    ContactsManagerComponent,
    NotificationsCenterComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }