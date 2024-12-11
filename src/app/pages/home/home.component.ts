import { Component, inject} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TaskComponent } from '../../components/tasks/tasks.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { TaskInterface } from '../../interfaces/task.interface';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ TaskComponent, CommonModule, MatButtonModule, MatToolbarModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'Gestão de Tarefas';
  isLoggedIn: boolean = false;
  router = inject(Router);
  selectedTask: TaskInterface | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user; 
    });
  }

  toggleAddTaskForm() {
    this.router.navigate(['/task-form']);
  }
}


