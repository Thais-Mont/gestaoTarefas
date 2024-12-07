import { Component, Output,EventEmitter, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { TaskInterface } from '../../interfaces/task.interface';
import { ModalMessageComponent } from "../modal-message/modal-message.component";
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ModalMessageComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {

  errorMessage: string = '';
  showModal: boolean = false;
  modalMessage: string = '';
  modalType: 'success' | 'error' = 'success';
  form: FormGroup;


  constructor(private taskService: TaskService, private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      responsibleCpf: ['', Validators.required],
      responsibleEmail: ['', Validators.required],
      responsibleName: ['', Validators.required],
      status: ['pending', Validators.required],
    });
  }

  onSubmit() {
    console.log(this.form)
    if (this.form.valid) {  
      const newTask: TaskInterface = this.form.value;
      this.taskService.addTask(newTask).then(() => {
        this.modalMessage = 'Tarefa criada com sucesso!';
        this.modalType = 'success';
        this.showModal = true;

        setTimeout(() => {
          this.showModal = false;
          this.form.reset();
        }, 3000);
       
      }).catch((error) => {
        console.error(error)
        this.modalMessage = 'Ocorreu um erro ao criar a tarefa.';
        this.modalType = 'error';
        this.showModal = true;
      })
    } else {
      this.modalMessage = 'Por favor, preencha todos os campos corretamente.';
      this.modalType = 'error';
      this.showModal = true;
    }
  }
}
