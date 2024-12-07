// navbar.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  
  constructor(private authService: AuthService) {}

  // Método de logout
  logout() {
    this.authService.logout().subscribe(() => {
      // Redirecionar para a página de login ou qualquer outra ação necessária
      console.log('Usuário deslogado');
    });
  }
}
