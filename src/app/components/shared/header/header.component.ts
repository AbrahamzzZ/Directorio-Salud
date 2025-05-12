import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServLoginService } from '../../../services/serv-login.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  idProfesional: string | null | undefined = null;

  constructor(public miServicio: ServLoginService) {
    this.idProfesional = this.miServicio.getIdentificador();
  }
}
