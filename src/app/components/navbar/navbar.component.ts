import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [MatButtonModule, MatToolbarModule, MatIconModule, CommonModule],
  standalone: true
})
export class NavbarComponent {

  @Output() closeAddTaskForm = new EventEmitter<void>();

  router = inject(Router);
  isLoggedIn = signal(false);
  menuOpen = false;


  constructor(private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn.set(!!user);
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  goToTasks() {
    this.closeAddTaskForm.emit();
    this.router.navigateByUrl('/home');
  }

  goToStatistics() {
    this.router.navigateByUrl('/statistics');
  }
  
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.currentUserSig.set(null);
        this.isLoggedIn.set(false);
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        console.error('Erro durante o logout:', err);
      }
    });
  }
  
  
}


