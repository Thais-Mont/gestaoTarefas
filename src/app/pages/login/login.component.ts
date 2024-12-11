import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule,],
})
export class LogicComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  showPassword = false;

  constructor(library: FaIconLibrary) {
    library.addIcons(faEye, faEyeSlash);
  }

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  errorMessage: string | null = null;

  handleAuthError(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado!';
      case 'auth/wrong-password':
        return 'Senha incorreta!';
      case 'auth/invalid-credential':
        return 'Email ou Senha Inválidos!';
      default:
        return 'Erro ao tentar logar!';
    }
  }

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    if(rawForm.email && rawForm.password){
      this.authService.login(rawForm.email, rawForm.password).subscribe({
        next: () => {
          this.router.navigateByUrl('/home');
        },
        error: (error) => {
          this.errorMessage = this.handleAuthError(error.code);
        },
      })
    } else {
      this.errorMessage = 'Preencha todos os campos!';
    }
  
  };

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    }
  }
}