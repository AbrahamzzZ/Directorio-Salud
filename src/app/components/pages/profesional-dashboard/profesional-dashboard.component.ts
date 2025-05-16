import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ServCitaService } from '../../../services/servicio-cita/serv-cita.service';
import { ServLoginService } from '../../../services/serv-login.service';
import { ServProfesionalesService } from '../../../services/servicio-profesional/serv-profesionales.service';
import { ServServiciosjsonService } from '../../../services/servicio-servicios/serv-serviciosjson.service';
import { Profesional } from '../../../models/Profesional';
import { map, switchMap, tap } from 'rxjs/operators';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-profesional-dashboard',
  imports: [
    HeaderComponent, FooterComponent, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule,
    DatePipe, CommonModule, MatIconModule, FormsModule, MatCardModule
  ],
  templateUrl: './profesional-dashboard.component.html',
  styleUrl: './profesional-dashboard.component.css'
})
export class ProfesionalDashboardComponent implements OnInit {
  citasProfesional: any[] = [];
  terminoBusqueda = '';
  citasFiltradas: any[] = [];
  profesionalId = '';
  profesionalInfo: Profesional | null = null;

  @ViewChild(MatPaginator) paginador!: MatPaginator;

  constructor(
    private servicioCita: ServCitaService,
    private servicioLogin: ServLoginService,
    private servicioProfesional: ServProfesionalesService,
    private servicioServicios: ServServiciosjsonService
  ) { }

  ngOnInit(): void {
    this.profesionalId = this.servicioLogin.getIdentificador() ?? '';
    if (this.profesionalId) {
      this.cargarDatosProfesionalYCitas();
    } else {
      console.error('No se encontró un ID de profesional válido');
    }
  }

  cargarDatosProfesionalYCitas(): void {
    this.servicioProfesional.obtenerprofesionalID(this.profesionalId)
      .pipe(
        tap(profesional => this.profesionalInfo = profesional),
        switchMap(() => this.servicioCita.getCitas()),
        map(citas => citas.filter(cita => cita.profesionalId === this.profesionalId)),
        switchMap(citasFiltradas =>
          this.servicioServicios.getAllServices().pipe(
            map(servicios => citasFiltradas.map(cita => ({
              ...cita,
              nombreServicio: servicios.find(s => s.id === cita.servicioId)?.nombre || 'Sin nombre',
              especialidad: this.profesionalInfo?.especialidad || 'Especialidad',
              usuarioId: this.servicioLogin.getIdentificador() || 'nombre'
            })))
          )
        )
      )
      .subscribe(
        citasConServicio => {
          this.citasProfesional = citasConServicio;
          this.citasFiltradas = [...this.citasProfesional];
        },
        error => console.error('Error al cargar citas o servicios:', error)
      );
  }

  buscar(input: HTMLInputElement): void {
    const termino = input.value.trim().toLowerCase();
    this.citasFiltradas = this.citasProfesional.filter(cita =>
      cita.nombreServicio?.toLowerCase().includes(termino) ||
      cita.especialidad?.toLowerCase().includes(termino) ||
      cita.direccion?.toLowerCase().includes(termino) ||
      cita.metodoPago?.toLowerCase().includes(termino) ||
      cita.prioridad?.toLowerCase().includes(termino) ||
      cita.estado?.toLowerCase().includes(termino) ||
      (cita.fechaHora && new Date(cita.fechaHora).toLocaleDateString().includes(termino))
    );
  }
}
