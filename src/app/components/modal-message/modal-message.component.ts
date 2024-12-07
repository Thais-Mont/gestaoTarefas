import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-message',
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class ModalMessageComponent {
  @Input() title: string = 'Mensagem';
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success'; 
  @Input() show: boolean = false; 

  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
