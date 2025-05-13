import { Component, Renderer2 } from '@angular/core';
import { ServLoginService } from '../../../services/serv-login.service';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatToolbarModule, RouterOutlet, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  menuAbierto = false;

  constructor(public miServicio: ServLoginService, private renderer: Renderer2) {}

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
    const body = document.body; // Obtén una referencia al body
    if (this.menuAbierto) {
      this.renderer.addClass(body, 'menu-abierto'); // Agrega la clase al body
    } else {
      this.renderer.removeClass(body, 'menu-abierto'); // Remueve la clase del body
    }
  }
}
