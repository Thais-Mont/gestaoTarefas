import { Component, EventEmitter, OnInit, Output, ViewChild, AfterViewInit, LOCALE_ID, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskInterface } from '../../interfaces/task.interface';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepickerModule, MatDateRangeInput} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TaskItemComponent } from "../task-item/task-item.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatSortModule, 
    ConfirmModalComponent,
    MatTableModule,
    MatButtonModule, 
    MatSelectModule, 
    MatIconModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatNativeDateModule, 
    TaskItemComponent],
})

export class TaskComponent implements OnInit, AfterViewInit {
  tasks: MatTableDataSource<TaskInterface> = new MatTableDataSource<TaskInterface>([]);
  newTaskForm: FormGroup;
  showModal: boolean = false;
  taskToDelete: string | null = null;
  selectedTask: TaskInterface | null = null; 
  showAddTaskForm: boolean = false;
  displayedColumns: string[] = ['title', 'dueDate', 'responsible', 'status', 'actions'];
  filteredTasks = new MatTableDataSource(this.tasks.data);
  isCustomPeriod = false;
  router = inject(Router);

  @ViewChild(MatSort) sort!: MatSort; 

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

  startDate = new FormControl(new Date().toISOString().split('T')[0]);
  endDate = new FormControl(new Date().toISOString().split('T')[0]); 
  defaultDate = new FormControl(new Date().toISOString().split('T')[0]);   
  
  ngOnInit(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    this.startDate.setValue(thirtyDaysAgo.toISOString().split('T')[0]);
    this.endDate.setValue(today.toISOString().split('T')[0]);
    this.onDateChange();
  }
  
  ngAfterViewInit(): void {
    this.tasks.sort = this.sort;  
  }
  
  onSearch(event: Event): void {
    const input = (event.target as HTMLInputElement)?.value.trim().toLowerCase();
    this.filteredTasks.filter = input;
  }
  

  onDateChange(): void {
    const startDateValue = this.startDate.value;
    const endDateValue = this.endDate.value;

    if (startDateValue && endDateValue) {
      const startDateISO = new Date(startDateValue).toISOString();
      const endDateISO = new Date(endDateValue).toISOString();
      this.taskService.getTasksByDateRange(startDateISO, endDateISO).subscribe({
        next: (tasks) => {
          this.tasks.data = tasks;
          this.filteredTasks = new MatTableDataSource<TaskInterface>(tasks);
          this.filteredTasks.sort = this.sort; 
        },
        error: (error) => {
          console.error('Erro ao buscar tarefas:', error);
        }
      });
    }
  }

  onDateRangeApply(dateRangeInput: MatDateRangeInput<Date>): void {
    const startDate = dateRangeInput.value?.start; 
    const endDate = dateRangeInput.value?.end;
  
    if (startDate && endDate) {
      const startDateISO = startDate.toISOString();
      const endDateISO = endDate.toISOString();
  
      this.taskService.getTasksByDateRange(startDateISO, endDateISO).subscribe({
        next: (tasks) => {
          this.tasks.data = tasks;
          this.filteredTasks = new MatTableDataSource<TaskInterface>(tasks);
          this.filteredTasks.sort = this.sort; 
        },
        error: (error) => {
          console.error('Erro ao buscar tarefas:', error);
        }
      });
    } else {
      console.warn('Datas inválidas');
    }
  }
  
  
  statusChange(status: string): void {
    if (status === 'all') {
      this.filteredTasks.data = [...this.tasks.data]; 
    } else {
      this.filteredTasks.data = this.tasks.data.filter(task => task.status === status);
    }
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

  onStatusChange(event: any, task: TaskInterface): void {
    const newStatus = event.value;
    task.status = newStatus;
    this.taskService.updateTask(task).subscribe({
      next: () => {
        console.log(`Status da tarefa ${task.id} alterado para ${newStatus}`);
      },
      error: (error) => {
        console.error('Erro ao alterar status:', error);
      }
    });
  }

  openConfirmModal(taskId: string): void {
    this.taskToDelete = taskId;
    this.showModal = true;
  }

  getTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks.data = data;  
        this.filteredTasks = new MatTableDataSource<TaskInterface>(data);
        this.filteredTasks.sort = this.sort;
      },
      error: (error) => {
        console.error('Erro ao buscar tarefas:', error);
      }
    });
  }
  

  addTask(): void {
    if (this.newTaskForm.valid) {  
      const newTask: TaskInterface = this.newTaskForm.value;
      this.taskService.addTask(newTask).subscribe({
        next: () => {
          this.newTaskForm.reset();
          console.log('Tarefa adicionada com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao adicionar tarefa:', error);
        }
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
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          console.log('Tarefa excluída com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao excluir tarefa:', error);
        }
      });
    }
  }

  updateTask(task: TaskInterface): void {
    this.taskService.updateTask(task).subscribe({
      next: () => {
        console.log('Tarefa atualizada com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao atualizar tarefa:', error);
      }
    });
  }

  editTask(task: TaskInterface): void {
    this.selectedTask = task;
    this.router.navigate(['/task-form', task.id]);
  }

  viewTaskSelected: TaskInterface | null = null
  showModalDetails: boolean = false
  onTaskClick(task: TaskInterface): void {
    this.viewTaskSelected = task;
    this.showModalDetails = true;
  }

  closeModal(): void {
    this.showModalDetails = false;
    this.viewTaskSelected = null; 
  }
  
  resetForm(): void {
    this.selectedTask = null;
  }
}
