import { Component, Renderer2 } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ServLoginService } from '../../../services/serv-login.service';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatIconModule, RouterOutlet, MatToolbarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  menuAbierto = false;
  idProfesional: string | null | undefined = null;

  constructor(public miServicio: ServLoginService, private renderer: Renderer2, private router: Router) {
    this.idProfesional = this.miServicio.getIdentificador();
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
    const body = document.body; 
    if (this.menuAbierto) {
      this.renderer.addClass(body, 'menu-abierto'); 
    } else {
      this.renderer.removeClass(body, 'menu-abierto'); 
    }
  }

  cerrarSesion() {
    this.miServicio.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
