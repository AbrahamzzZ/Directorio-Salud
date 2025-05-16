import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ServCitaService } from '../../../../services/servicio-cita/serv-cita.service';
import { Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { Cita } from '../../../../models/Citas';
import { Profesional } from '../../../../models/Profesional';
import { ServicioMedico } from '../../../../models/ServicioMedico';
import { ServProfesionalesService } from '../../../../services/servicio-profesional/serv-profesionales.service';
import { ServServiciosjsonService } from '../../../../services/servicio-servicios/serv-serviciosjson.service';
import { TablaReutilizableComponent } from '../../../shared/tabla-reutilizable/tabla-reutilizable.component';
import { DialogoComponent } from '../../../shared/dialogo/dialogo.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { HeaderComponent } from '../../../shared/header/header.component';

@Component({
  selector: 'app-mantenimiento-paciente-cita',
    imports: [HeaderComponent,FooterComponent, MatTableModule, MatPaginatorModule,
    MatButtonModule, MatInputModule,CommonModule, TablaReutilizableComponent // Asegúrate de incluirlo en los imports
  ],
  templateUrl: './mantenimiento-paciente-cita.component.html',
  styleUrl: './mantenimiento-paciente-cita.component.css',
})
export class MantenimientoPacienteCitaComponent implements OnInit {
  sourceDatos = new MatTableDataSource<any>([]);
  listadoCitas: Cita[] = [];
  mapaProfesionales: Map<string, Profesional> = new Map();
  mapaServicios: Map<string, ServicioMedico> = new Map();
  columnasCitas = [
    { key: 'profesional', titulo: 'Profesional' },
    { key: 'especialidad', titulo: 'Especialidad' },
    { key: 'direccion', titulo: 'Dirección' },
    { key: 'metodoPago', titulo: 'Método de Pago' },
    { key: 'prioridad', titulo: 'Prioridad' },
    {
      key: 'fechaHora',
      titulo: 'Fecha y Hora',
      pipe: 'date',
      pipeArgs: 'yyyy-MM-dd',
    },
    { key: 'estado', titulo: 'Estado' },
  ];
  columnasKeysCitas: string[] = this.columnasCitas.map((col) => col.key);
  accionesCitas = [
    { tipo: 'editar', icono: 'edit', tooltip: 'Editar cita' },
    { tipo: 'eliminar', icono: 'delete', tooltip: 'Eliminar cita' },
  ];

  @ViewChild(MatPaginator) paginador!: MatPaginator;

  constructor(
    private servicioCita: ServCitaService, private servicioProfesional: ServProfesionalesService, 
    private servicioServicios: ServServiciosjsonService, private navegador: Router, private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarCitasConDatosProfesionales();
  }

  cargarCitasConDatosProfesionales(): void {
    this.servicioCita
      .getCitas()
      .pipe(
        tap((citas) => (this.listadoCitas = citas)),
        switchMap(() => this.servicioServicios.getAllServices()),
        tap((servicios) => {
          servicios.forEach((servicio) => {
            if (servicio.id) this.mapaServicios.set(servicio.id, servicio);
          });
        }),
        switchMap(() => this.servicioProfesional.getProfesionales()),
        tap((profesionales) => {
          profesionales.forEach((profesional) => {
            if (profesional.id)
              this.mapaProfesionales.set(profesional.id, profesional);
          });
        }),
        map(() =>
          this.listadoCitas.map((cita) => {
            let especialidad = 'No disponible';
            let profesional = 'No asignado';

            const profesionalData = cita.profesionalId
              ? this.mapaProfesionales.get(cita.profesionalId)
              : cita.servicioId && this.mapaServicios.get(cita.servicioId)?.profesionalId
              ? this.mapaProfesionales.get(
                  this.mapaServicios.get(cita.servicioId)!.profesionalId!
                )
              : undefined;

            if (profesionalData) {
              especialidad = profesionalData.especialidad || 'No disponible';
              profesional = profesionalData.nombre;
            }

            return {
              ...cita,
              especialidad,
              profesional,
            };
          })
        )
      )
      .subscribe(
        (data) => {
          this.sourceDatos.data = data;
        },
        (error) =>
          console.error(
            'Error al cargar citas con especialidades y profesionales:',
            error
          )
      );
  }

  editarCita(cita: any): void {
    this.navegador.navigate(['/registro-actualizacion-cita', cita.id], {
      queryParams: { servicioId: cita.servicioId },
    });
  }

  search(searchInput: HTMLInputElement) {
    const termino = searchInput.value.trim().toLowerCase();
    const citasFiltradas = this.listadoCitas
      .filter((cita) => {
        let nombreProfesional = '';
        const profesionalData = cita.profesionalId
          ? this.mapaProfesionales.get(cita.profesionalId)
          : cita.servicioId && this.mapaServicios.get(cita.servicioId)?.profesionalId
          ? this.mapaProfesionales.get(
              this.mapaServicios.get(cita.servicioId)!.profesionalId!
            )
          : undefined;

        nombreProfesional = profesionalData ? profesionalData.nombre : '';

        return (
          cita.direccion.toLowerCase().includes(termino) ||
          cita.metodoPago.toLowerCase().includes(termino) ||
          cita.prioridad.toLowerCase().includes(termino) ||
          cita.estado.toLowerCase().includes(termino) ||
          (profesionalData?.especialidad?.toLowerCase().includes(termino) ??
            false) ||
          nombreProfesional.toLowerCase().includes(termino)
        );
      })
      .map((cita) => {
        let especialidad = 'No disponible';
        let nombreProfesional = 'No asignado';

        const profesionalData = cita.profesionalId
          ? this.mapaProfesionales.get(cita.profesionalId)
          : cita.servicioId && this.mapaServicios.get(cita.servicioId)?.profesionalId
          ? this.mapaProfesionales.get(
              this.mapaServicios.get(cita.servicioId)!.profesionalId!
            )
          : undefined;

        if (profesionalData) {
          especialidad = profesionalData.especialidad || 'No disponible';
          nombreProfesional = profesionalData.nombre;
        }

        return {
          ...cita,
          especialidad,
          profesional: nombreProfesional,
        };
      });

    this.sourceDatos.data = citasFiltradas;
  }

  gestionarAccionCita(event: { tipo: string; fila: any }) {
    const { tipo, fila } = event;
    if (tipo === 'editar') {
      this.editarCita(fila);
    } else if (tipo === 'eliminar') {
      this.eliminarCitaConfirmacion(fila.id);
    }
  }

  eliminarCitaConfirmacion(citaId: string): void {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Eliminación',
        message: '¿Estás seguro de que deseas eliminar esta cita?',
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
        isConfirmation: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.eliminarCita(citaId);
      }
    });
  }

  eliminarCita(citaId: string): void {
    this.servicioCita.deleteCita(citaId).subscribe(() => {
      this.mostrarDialogo(
        'Eliminación Exitosa',
        'La cita se ha eliminado correctamente.'
      );
      this.cargarCitasConDatosProfesionales();
    }, (error) => {
      console.error('Error al eliminar la cita:', error);
      this.mostrarDialogo(
        'Error',
        'Hubo un problema al eliminar la cita. Por favor, inténtalo de nuevo.'
      );
    });
  }

  mostrarDialogo(title: string, message: string): void {
    this.dialog.open(DialogoComponent, {
      width: '400px',
      data: {
        title,
        message,
        confirmText: 'Aceptar',
        showCancelButton: false,
      },
    });
  }
}

