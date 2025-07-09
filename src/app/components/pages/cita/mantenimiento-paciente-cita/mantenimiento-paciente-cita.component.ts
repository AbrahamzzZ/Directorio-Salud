import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ServCitaService } from '../../../../services/servicio-cita/serv-cita.service';
import { Router } from '@angular/router';
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
import { ServLoginService } from '../../../../services/serv-login.service'; 

@Component({
  selector: 'app-mantenimiento-paciente-cita',
  imports: [HeaderComponent, FooterComponent, MatTableModule, MatPaginatorModule,
    MatButtonModule, MatInputModule, CommonModule, TablaReutilizableComponent
  ],
  templateUrl: './mantenimiento-paciente-cita.component.html',
  styleUrl: './mantenimiento-paciente-cita.component.css',
})
export class MantenimientoPacienteCitaComponent implements OnInit {
 sourceDatos = new MatTableDataSource<any>([]);
  listadoCitas: any[] = [];
  mapaProfesionales: Map<string, Profesional> = new Map();
  mapaServicios: Map<string, ServicioMedico> = new Map();
  columnasCitas = [
    { key: 'profesional', titulo: 'Profesional' },
    { key: 'especialidad', titulo: 'Especialidad' },
    { key: 'direccion', titulo: 'Dirección' },
    { key: 'metodoPago', titulo: 'Metodo de Pago' },
    { key: 'prioridad', titulo: 'Prioridad' },
    {
      key: 'fechaHora',
      titulo: 'Fecha y Hora',
      pipe: 'date',
      pipeArgs: 'dd/MM/yyyy HH:mm',
    },
    { key: 'estadoCita', titulo: 'Estado' },
  ];
  columnasKeysCitas: string[] = this.columnasCitas.map((col) => col.key);
  accionesCitas = [
    { tipo: 'editar', icono: 'edit', tooltip: 'Editar cita' },
    { tipo: 'eliminar', icono: 'delete', tooltip: 'Eliminar cita' },
  ];

  @ViewChild(MatPaginator) paginador!: MatPaginator;

  constructor(
    private servicioCita: ServCitaService,
    private servicioProfesional: ServProfesionalesService,
    private servicioServicios: ServServiciosjsonService,
    private navegador: Router,
    private dialog: MatDialog,
    private servicioLogin: ServLoginService
  ) {}

  ngOnInit(): void {
    this.cargarCitasDelPaciente();
  }

  cargarCitasDelPaciente(): void {
    const pacienteId = this.servicioLogin.getIdentificador();
    console.log('ID del paciente:', pacienteId);

    if (pacienteId) {
      this.servicioCita.getCitasDetalladasPorPaciente(pacienteId).subscribe({
        next: (data) => {
          console.log('Datos recibidos del backend:', data);
          this.listadoCitas = data.map((item) => ({
            ...item,
            profesional: item.profesionalNombre,
            especialidad: item.especialidad,
            direccion: item.direccionProfesional,
          }));
          this.sourceDatos.data = this.listadoCitas;
          if (this.paginador) {
            this.sourceDatos.paginator = this.paginador;
          }
        },
        error: (err) => {
          console.error('Error al cargar citas detalladas:', err);
          this.sourceDatos.data = [];
          this.listadoCitas = [];
        },
      });
    } else {
      console.warn('No se pudo obtener el ID del paciente.');
      this.sourceDatos.data = [];
      this.listadoCitas = [];
    }
  }

  editarCita(cita: any): void {
    this.navegador.navigate(['/registro-actualizacion-cita', cita.id], {
      queryParams: { servicioId: cita.servicioId },
    });
  }

  search(searchInput: HTMLInputElement) {
    const termino = searchInput.value.trim().toLowerCase();
    const citasFiltradas = this.listadoCitas.filter((cita) => {
      return (
        (cita.profesional?.toLowerCase().includes(termino) ?? false) ||
        (cita.especialidad?.toLowerCase().includes(termino) ?? false) ||
        (cita.direccion?.toLowerCase().includes(termino) ?? false) ||
        (cita.metodoPago?.toLowerCase().includes(termino) ?? false) ||
        (cita.prioridad?.toLowerCase().includes(termino) ?? false) ||
        (cita.estadoCita?.toLowerCase().includes(termino) ?? false)
      );
    });

    this.sourceDatos.data = citasFiltradas;
    if (this.paginador) {
      this.sourceDatos.paginator = this.paginador;
      this.paginador.firstPage();
    }
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
    if (!citaId || isNaN(Number(citaId))) {
      console.error('ID de cita inválido');
      this.mostrarDialogo(
        'Error',
        'ID de cita inválido. No se puede eliminar la cita.'
      );
      return;
    }

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
    this.servicioCita.deleteCita(Number(citaId)).subscribe(
      () => {
        this.mostrarDialogo(
          'Eliminación Exitosa',
          'La cita se ha eliminado correctamente.'
        );
        this.cargarCitasDelPaciente();
      },
      (error) => {
        console.error('Error al eliminar la cita:', error);
        this.mostrarDialogo(
          'Error',
          'Hubo un problema al eliminar la cita. Por favor, inténtalo de nuevo.'
        );
      }
    );
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
