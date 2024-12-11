import { Component, EventEmitter, inject, Input,  LOCALE_ID,  Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ModalMessageComponent } from "../modal-message/modal-message.component";
import { CommonModule } from '@angular/common';
import { TaskInterface } from '../../interfaces/task.interface';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';



@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, ModalMessageComponent, MatProgressSpinnerModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})

export class AddTaskComponent {
  errorMessage: string = '';
  showModal: boolean = false;
  modalMessage: string = '';
  modalType: 'success' | 'error' = 'success';
  form: FormGroup;
  router = inject(Router);
  isLoading = false;

  @Output() closeForm = new EventEmitter<void>();
  @Input() selectedTask: TaskInterface | null = null;

  constructor(private taskService: TaskService, private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      responsibleCpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      responsibleEmail: ['', [Validators.required, Validators.email]],
      responsibleName: ['', Validators.required],
      status: ['pending', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.selectedTask) {
      this.form.patchValue(this.selectedTask);
    }  else {
      this.form.reset();
    }
  }

  ngOnChanges(): void {
    if (this.selectedTask) {
      const formattedDueDate = this.formatDateCalendar(this.selectedTask.dueDate);
      this.form.patchValue({ ...this.selectedTask, dueDate: formattedDueDate });
    } else {
      this.form.reset();
    }
  }
  
  formatDateCalendar(date: string): any {
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
        
  }
  private formatDate(date: string): string {
    const dateObj = new Date(date);
    return dateObj.toISOString();  
  }
  
 

  editTask(updatedTask: TaskInterface): void {
    if (this.selectedTask) {
      const taskToUpdate = { ...this.selectedTask, ...updatedTask };
   
      firstValueFrom(this.taskService.updateTask(taskToUpdate))
        .then(() => {
          this.modalMessage = 'Tarefa editada com sucesso!';
          this.modalType = 'success';
          this.showModal = true;
          this.isLoading = true;
  
          setTimeout(() => {
            this.showModal = false;
            this.isLoading = false;
            this.closeForm.emit();
            this.form.reset();
            this.router.navigate(['/home']);
          }, 3000);
        })
        .catch((error: any) => {
          console.error(error);
          this.isLoading = false;
          this.modalMessage = 'Ocorreu um erro ao editar a tarefa.';
          this.modalType = 'error';
          this.showModal = true;
        });
    }
  }
  
  onSubmit() {
    if (this.form.valid) {
      const taskData = this.form.value;
  
      taskData.dueDate = this.formatDate(taskData.dueDate);
  
      if (this.selectedTask) {
        this.editTask(taskData);
      } else {
        firstValueFrom(this.taskService.addTask(taskData))
          .then(() => {
            this.modalMessage = 'Tarefa criada com sucesso!';
            this.modalType = 'success';
            this.showModal = true;
            this.isLoading = true;
  
            setTimeout(() => {
              this.showModal = false;
              this.isLoading = false;
              this.closeForm.emit();
              this.form.reset();
              this.router.navigate(['/home']);
            }, 3000);
          })
          .catch((error: any) => {
            console.error(error);
            this.isLoading = false;
            this.modalMessage = 'Ocorreu um erro ao criar a tarefa.';
            this.modalType = 'error';
            this.showModal = true;
          });
      }
    } else {
      this.modalMessage = 'Por favor, preencha todos os campos corretamente.';
      this.modalType = 'error';
      this.showModal = true;
    }
  }
  
}
