import { AuthService } from './services/auth.service';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  AuthService = inject(AuthService);
  router = inject(Router);
 ngOnInit(): void {
    this.AuthService.user$.subscribe((user) => {
      if (user) {
        this.AuthService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!,
        });
      } else {
        this.AuthService.currentUserSig.set(null);
      }
    });
 };

  logout() {
    this.AuthService.logout();
    this.router.navigateByUrl('/login');
  }
}