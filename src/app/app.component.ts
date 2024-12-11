import { AuthService } from './services/auth.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  isLoggedIn = signal(false);
  isLoginRoute = false;

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const hiddenRoutes = ['/login', '/register', '/forgot-password'];
        this.isLoginRoute = hiddenRoutes.includes(event.url);
      }
    });
    
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.isLoggedIn.set(!!user); 
    });
  }
}
