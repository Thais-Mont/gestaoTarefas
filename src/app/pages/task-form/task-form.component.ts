import { Component, inject } from '@angular/core';
import { TaskInterface } from '../../interfaces/task.interface';
import { AddTaskComponent } from '../../components/add-task/add-task.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';


@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ AddTaskComponent],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  selectedTask: TaskInterface | null = null;
  router = inject(Router);

  taskId: string | null = null;

  constructor(private route: ActivatedRoute, private taskService: TaskService,) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe(task => {
        console.log(task)
        if (task) {
          this.selectedTask = task;
        }
      })

    }
  }
  

  toggleAddTaskForm() {
    this.router.navigate(['/home']);
  }

}
