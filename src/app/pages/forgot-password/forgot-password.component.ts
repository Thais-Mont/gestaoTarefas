import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalMessageComponent } from '../../components/modal-message/modal-message.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    imports: [ReactiveFormsModule, CommonModule, ModalMessageComponent],
    standalone: true
})
export class ForgotPasswordComponent {
    fb = inject(FormBuilder);
    router = inject(Router);
    errorMessage: string | null = null;
    showModal: boolean = false;
    modalMessage: string = '';
    modalType: 'success' | 'error' = 'success';

    form = this.fb.group({ 
        email: ['', [Validators.required, Validators.email]]
    });

    constructor(private authService: AuthService) {}

    onForgotPassword(): void {
        const rawForm = this.form.getRawValue();
        if (rawForm.email) {
            this.errorMessage = null;
            this.authService.forgotPassword(rawForm.email).subscribe({
                next: () => {
                    this.modalType = 'success';
                    this.modalMessage = 'Link de redefinição enviado!';
                    this.showModal = true;
              
                    setTimeout(() => {
                      this.router.navigateByUrl('/login');
                    }, 3000);
                },
                error: (error) => {
                    this.errorMessage = error.message;
                    console.error(error);
                }
            });
        } else {
            this.errorMessage = 'Por favor, insira um endereço de e-mail.';
        }
    }
}
