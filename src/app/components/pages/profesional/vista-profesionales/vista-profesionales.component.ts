import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, NgFor } from '@angular/common';
import { Profesional } from '../../../../models/Profesional';
import { ServProfesionalesService } from '../../../../services/servicio-profesional/serv-profesionales.service';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { HeaderComponent } from '../../../shared/header/header.component';
import { DisponibilidadProfesional } from '../../../../models/Disponibilidad-profesional';


@Component({
  selector: 'app-vista-profesionales',
  imports: [HeaderComponent, FooterComponent, MatCardModule, MatButtonModule, FormsModule, MatInputModule, MatIcon, DatePipe, NgFor],
  templateUrl: './vista-profesionales.component.html',
  styleUrl: './vista-profesionales.component.css'  
})
export class VistaProfesionalesComponent {
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
      this.servicio.buscarProfesionales(termino, termino, termino).subscribe((datos: Profesional[]) => {
        this.profesionales = datos;
      });
    } else {
      this.cargarTodos();
    }
  }

  irAResena(profesionalId: string): void {
    this.router.navigate(['/resena-register', profesionalId]);
  }

  verResenas(profesionalId: string): void {
    this.router.navigate(['/ver-resenas', profesionalId]);
  }

  trackByProfesional(index: number, profesional: Profesional): string {
    return profesional.id!;
  }

  trackByDisponibilidad(index: number, fecha: DisponibilidadProfesional): string {
    return fecha.id!;
  }
}

