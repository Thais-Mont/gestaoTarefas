
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common';
import { TaskInterface } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  @Input() tarefa!:TaskInterface;
  @Output() onDeleteTask = new EventEmitter<TaskInterface>();
  @Output() onToggleConcluido = new EventEmitter<TaskInterface>();

 


  onDelete(tarefa: TaskInterface){
    this.onDeleteTask.emit(tarefa);
  }

  onToggle(tarefa: TaskInterface){
    this.onToggleConcluido.emit(tarefa);
  }
}
