import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Profesional } from '../../../models/Profesional';
import { ServProfesionalesService } from '../../../services/servicio-profesional/serv-profesionales.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-pacientes-dashboard',
  imports: [HeaderComponent, FooterComponent, MatCardModule, MatButtonModule, FormsModule, MatInputModule, MatIcon],
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

  formatDisponibilidad(fechas: string[]): string {
    // Si es una sola fecha, la formateamos directamente
    const fechaUnica = fechas.join(',');
    if (!fechaUnica.includes(',')) {
        return new Date(fechaUnica).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Si hay múltiples fechas, las procesamos una por una
    const fechasArray = fechaUnica.split(',');
    return fechasArray.map(fecha => {
        return new Date(fecha.trim()).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }).join(', ');
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
