import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LogicComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { HomeComponent } from './pages/home/home.component';
import { StatisticComponent } from './pages/statistic/statistic.component';
import { TaskFormComponent } from './pages/task-form/task-form.component';

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
    path: 'statistics',
    component: StatisticComponent
  },
  {
    path: 'task-form',
    component: TaskFormComponent
  },
  {
    path: 'task-form/:id',
    component: TaskFormComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  }
];