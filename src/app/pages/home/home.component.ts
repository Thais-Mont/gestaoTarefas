import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TaskComponent } from '../../components/tasks/tasks.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AddTaskComponent } from '../../components/add-task/add-task.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ TaskComponent, CommonModule, AddTaskComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'Gestão de Tarefas';
  isLoggedIn: boolean = false;
  router = inject(Router);
  showAddTaskForm = true; 

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user; 
    });
  }

  toggleAddTaskForm() {
    this.showAddTaskForm = !this.showAddTaskForm;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.isLoggedIn = false;
      this.router.navigateByUrl('/login');
    });
  }

  
}
