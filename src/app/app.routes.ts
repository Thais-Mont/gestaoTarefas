import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LogicComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
     path: '', 
    redirectTo: '/home', 
    pathMatch: 'full' 
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LogicComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  }
];