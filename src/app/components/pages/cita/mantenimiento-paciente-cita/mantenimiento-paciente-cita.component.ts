import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Router } from '@angular/router';
import {  map, switchMap,tap } from 'rxjs';
import { Cita } from '../../../../models/Citas';
import { Profesional } from '../../../../models/Profesional';
import { DatePipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MatIcon } from '@angular/material/icon';
import { ServicioMedico } from '../../../../models/ServicioMedico';
import { ServProfesionalesService } from '../../../../services/servicio-profesional/serv-profesionales.service';
import { ServServiciosjsonService } from '../../../../services/servicio-servicios/serv-serviciosjson.service';
import { ServCitaService } from '../../../../services/servicio-cita/serv-cita.service';

@Component({
  selector: 'app-mantenimiento-paciente-cita',
    imports: [
    HeaderComponent,
    FooterComponent,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatInputModule,
    DatePipe,
    CommonModule,
  ],
  templateUrl: './mantenimiento-paciente-cita.component.html',
  styleUrl: './mantenimiento-paciente-cita.component.css'
})
export class MantenimientoPacienteCitaComponent implements OnInit {

  displayedColumns: string[] = ['especialidad', 'direccion', 'metodoPago', 'prioridad', 'fechaHora', 'estado', 'acciones'];
  sourceDatos = new MatTableDataSource<any>([]);
  listadoCitas: Cita[] = [];
  mapaProfesionales: Map<string, Profesional> = new Map();
  mapaServicios: Map<string, ServicioMedico> = new Map();


  @ViewChild(MatPaginator) paginador!: MatPaginator;

  constructor(
    private servicioCita: ServCitaService,
    private servicioProfesional: ServProfesionalesService,
    private servicioServicios: ServServiciosjsonService,
    private navegador: Router
  ) { }

  ngOnInit(): void {
    this.cargarCitasConDatosProfesionales();
  }

  cargarCitasConDatosProfesionales(): void {
  this.servicioCita.getCitas().pipe(
    tap(citas => {
      this.listadoCitas = citas;
      console.log('Citas cargadas:', citas); // Para depuración
    }),
    // Primero, vamos a cargar todos los servicios
    switchMap(() => this.servicioServicios.getAllServices()),
    tap(servicios => {
      console.log('Servicios cargados:', servicios); // Para depuración
      servicios.forEach(servicio => {
        if (servicio.id) {
          this.mapaServicios.set(servicio.id, servicio);
        }
      });
    }),
    // Luego, cargar todos los profesionales
    switchMap(() => this.servicioProfesional.getProfesionales()),
    tap(profesionales => {
      console.log('Profesionales cargados:', profesionales); // Para depuración
      profesionales.forEach(profesional => {
        if (profesional.id) {
          this.mapaProfesionales.set(profesional.id, profesional);
        }
      });
    }),
    // Finalmente, procesar y mapear los datos
    map(() => {
      return this.listadoCitas.map(cita => {
        // Priorizar la obtención de la especialidad desde el profesional asociado directamente a la cita
        let especialidad = 'No disponible';
        
        // 1. Intentar obtener desde profesionalId directo (si existe)
        if (cita.profesionalId && this.mapaProfesionales.has(cita.profesionalId)) {
          especialidad = this.mapaProfesionales.get(cita.profesionalId)?.especialidad || 'No disponible';
        } 
        // 2. Si no tenemos profesionalId o no lo encontramos, intentar obtenerlo del servicio
        else if (cita.servicioId && this.mapaServicios.has(cita.servicioId)) {
          const servicio = this.mapaServicios.get(cita.servicioId);
          if (servicio?.profesionalId && this.mapaProfesionales.has(servicio.profesionalId)) {
            especialidad = this.mapaProfesionales.get(servicio.profesionalId)?.especialidad || 'No disponible';
          }
        }
        
        return {
          ...cita,
          especialidad: especialidad
        };
      });
    }),
  ).subscribe(
    (data) => {
      console.log('Datos procesados para la tabla:', data); // Para depuración
      this.sourceDatos.data = data;
      this.sourceDatos.paginator = this.paginador;
    }, 
    (error) => {
      console.error('Error al cargar citas con especialidades:', error);
    }
  );
}
  editarCita(cita: any): void {
  this.navegador.navigate(['/registro-actualizacion-cita', cita.id], {
    queryParams: { servicioId: cita.servicioId }
  });
}

 search(searchInput: HTMLInputElement){
    const termino = searchInput.value.trim();
    if (termino) {
      this.sourceDatos.data = this.sourceDatos.data.filter(cita =>
        cita.direccion.toLowerCase().includes(termino.toLowerCase()) ||
        cita.metodoPago.toLowerCase().includes(termino.toLowerCase()) ||
        cita.prioridad.toLowerCase().includes(termino.toLowerCase()) ||
        cita.estado.toLowerCase().includes(termino.toLowerCase()) ||
        cita.especialidad.toLowerCase().includes(termino.toLowerCase())
      );
    } else {
      this.sourceDatos.data = this.listadoCitas.map(cita => ({
        ...cita,
        especialidad: this.mapaProfesionales.get(cita.profesionalId)?.especialidad || 'No disponible'
      }));
      this.sourceDatos.paginator = this.paginador;
    }
  }

  eliminarCita(element: any): void {
  const confirmar = confirm(`¿Está seguro que desea eliminar la cita en ${element.direccion}?`);
  if (confirmar) {
    this.servicioCita.deleteCita(element.id).subscribe(
      () => {
        alert('Cita eliminada con éxito');
        this.sourceDatos.data = this.sourceDatos.data.filter(cita => cita.id !== element.id);
        this.listadoCitas = this.listadoCitas.filter(cita => cita.id !== element.id);
      },
      error => {
        console.error('Error al eliminar la cita:', error);
        alert('Ocurrió un error al eliminar la cita. Por favor, inténtelo de nuevo.');
      }
    );
  }
}
}