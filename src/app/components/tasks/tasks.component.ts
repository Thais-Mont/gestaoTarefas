import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskInterface } from '../../interfaces/task.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Corrigir a importação
import { CommonModule } from '@angular/common';
import { AddTaskComponent } from "../add-task/add-task.component";
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ConfirmModalComponent],
})
export class TaskComponent implements OnInit {
  tasks: TaskInterface[] = [];
  
  newTaskForm: FormGroup;
  showModal: boolean = false;
  taskToDelete: string | null = null;

  constructor(private taskService: TaskService, private fb: FormBuilder) {
    this.newTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      responsibleCpf: ['', Validators.required],
      responsibleEmail: ['', Validators.required],
      responsibleName: ['', Validators.required],
      status: ['pending', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getTasks();
  }
  

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'inProgress':
        return 'inProgress';
      case 'completed':
        return 'completed';
      default:
        return 'pending';
    }
  }


  onStatusChange(event: Event, task: TaskInterface): void {
    const selectElement = event.target as HTMLSelectElement;
    // task.status = selectElement.value;
    this.updateTask(task);
  }

  openConfirmModal(taskId: string): void {
    this.taskToDelete = taskId;
    this.showModal = true;
  }

  getTasks(): void {
    this.taskService.getTasks().subscribe((data) => {
      this.tasks = data;
    });
  }

  addTask(): void {
    console.log(this.newTaskForm)
    if (this.newTaskForm.valid) {  
   
      const newTask: TaskInterface = this.newTaskForm.value;
      this.taskService.addTask(newTask).then(() => {
        this.newTaskForm.reset();
      });
    }
  }

  handleConfirmation(confirmed: boolean): void {
    if (confirmed && this.taskToDelete) {
      this.deleteTask(this.taskToDelete);
    } else {
      console.log('Ação cancelada');
    }
    this.showModal = false;
  }

  deleteTask(id: string): void {
    if(id) {
      this.showModal = false;
      this.taskService.deleteTask(id).
      then(() => console.log('Tarefa excluída com sucesso!')).
      catch((error) => console.error(error));
    }
  }

  updateTask(task: TaskInterface): void {
    this.taskService.updateTask(task).catch((error) => console.error(error));
  }
}
