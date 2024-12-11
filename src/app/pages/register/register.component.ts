import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 
import { ModalMessageComponent } from '../../components/modal-message/modal-message.component';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule, ModalMessageComponent],
})
export class RegisterComponent {

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);
  showPassword = false;
  showConfirmPassword = false;
  showModal: boolean = false;
  modalMessage: string = '';
  modalType: 'success' | 'error' = 'success';


  constructor(library: FaIconLibrary) {
    library.addIcons(faEye, faEyeSlash);
  }

  form = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]], 
    },
    { validators: this.passwordsMatchValidator }
  );
  
 

  get passwordsMismatch(): boolean {
    return this.form.hasError('passwordMismatch');
  }

  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
  
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  errorMessage: string | null = null;

  private getValidationMessages(): string {
    const messages: string[] = [];
  
    const usernameErrors = this.form.controls['username'].errors;
    if (usernameErrors) {
      if (usernameErrors['required']) {
        messages.push('O nome é obrigatório.');
      }
      if (usernameErrors['minlength']) {
        messages.push('O nome deve ter pelo menos 3 caracteres.');
      }
    }
  
    const emailErrors = this.form.controls['email'].errors;
    if (emailErrors) {
      if (emailErrors['required']) {
        messages.push('O email é obrigatório.');
      }
      if (emailErrors['email']) {
        messages.push('O email deve ser válido.');
      }
    }
  
    const passwordErrors = this.form.controls['password'].errors;
    if (passwordErrors) {
      if (passwordErrors['required']) {
        messages.push('A senha é obrigatória.');
      }
      if (passwordErrors['minlength']) {
        messages.push('A senha deve ter pelo menos 6 caracteres.');
      }
    }
  
    if (this.passwordsMismatch) {
      messages.push('As senhas precisam ser iguais.');
    }
  
    return messages.join(' ');
  }
  

  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = this.getValidationMessages();
      return;
    }
  
    const rawForm = this.form.getRawValue();
    this.authService
      .register(rawForm.email, rawForm.username, rawForm.password)
      .subscribe({
        next: () => {
          this.modalType = 'success';
          this.modalMessage = 'Conta criada com sucesso!';
          this.showModal = true;
    
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 3000);
        },
        error: (error) => {
          this.modalType = 'error';
          this.modalMessage = 'Ocorreu um erro ao criar a conta.';
          this.showModal = true;
        },
      });
  }
  
}