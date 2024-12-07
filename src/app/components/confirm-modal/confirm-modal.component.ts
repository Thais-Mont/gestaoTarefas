import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  @Output() confirmed = new EventEmitter<boolean>();

  closeModal(confirmed: boolean): void {
    this.confirmed.emit(confirmed);
  }

}
