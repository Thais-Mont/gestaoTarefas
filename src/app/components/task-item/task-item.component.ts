
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common';
import { TaskInterface } from '../../interfaces/task.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
  standalone: true,
  imports: [ CommonModule, MatFormFieldModule, MatSelectModule, MatIconModule],
})
export class TaskItemComponent {
  @Input() task: TaskInterface | null = null;
  @Output() close = new EventEmitter<void>(); 

  constructor() {}

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


  translateStatus(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'inProgress':
        return 'Em andamento';
      case 'completed':
        return 'Concluída';
      default:
        return 'Pendente';
    }
  }
}
