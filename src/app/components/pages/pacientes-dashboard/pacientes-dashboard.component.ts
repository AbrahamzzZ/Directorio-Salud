import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Profesional } from '../../../models/Profesional';
import { ServProfesionalesService } from '../../../services/serv-profesionales.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pacientes-dashboard',
  imports: [HeaderComponent, FooterComponent, MatCardModule, MatButtonModule, FormsModule, MatInputModule],
  templateUrl: './pacientes-dashboard.component.html',
  styleUrl: './pacientes-dashboard.component.css'
})
export class PacientesDashboardComponent {
  public profesionales: Profesional[] = [];
  public terminoBusqueda: string = '';

  constructor(private servicio: ServProfesionalesService, private router: Router) {
    this.cargarTodos();
  }

  cargarTodos(): void {
    this.servicio.getProfesionales().subscribe(data => {
      this.profesionales = data;
    });
  }

  buscar(searchInput: HTMLInputElement) {
    const termino = searchInput.value.trim();
    if (termino) {
      this.servicio.buscarProfesional(termino).subscribe(data => {
        this.profesionales = data;
      });
    } else {
      this.cargarTodos();
    }
  }

    irAResena(profesionalId: string): void {
    this.router.navigate(['/resena-register', profesionalId]);
  }
}
