import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  UpperCasePipe,
  CurrencyPipe,
  DatePipe,
  CommonModule,
} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  MatLabel,
  MatFormField,
  MatInputModule,
} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ServicioMedico } from '../../../../models/ServicioMedico';
import { ServServiciosjsonService } from '../../../../services/servicio-servicios/serv-serviciosjson.service';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { HeaderComponent } from '../../../shared/header/header.component';
import { ServCitaService } from '../../../../services/servicio-cita/serv-cita.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../../../models/Dialog-data';
import { DialogoComponent } from '../../../shared/dialogo/dialogo.component';
import { ServProfesionalesService } from '../../../../services/servicio-profesional/serv-profesionales.service'; // Importa el servicio de profesionales

@Component({
  selector: 'app-lista-servicios',
  imports: [
    HeaderComponent, FooterComponent, MatCardModule, MatButtonModule, UpperCasePipe, CurrencyPipe,
    DatePipe, CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatLabel, MatFormField,
    MatFormFieldModule, MatInputModule,
  ],
  templateUrl: './lista-servicios.component.html',
  styleUrls: ['./lista-servicios.component.css'],
})
export class ListaServiciosComponent implements OnInit {
 listaDeServicios: ServicioMedico[] = [];
  listaDeServiciosOriginal: ServicioMedico[] = [];
  public termSearch: string = '';

  constructor(
    private servicioDeServicios: ServServiciosjsonService,
    private servicioProfesional: ServProfesionalesService,
    private navegador: Router,
    private servicioCita: ServCitaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarServiciosFiltrados();
  }

  cargarServiciosFiltrados(): void {
    this.servicioProfesional.getProfesionales().subscribe((profesionales) => {
      const profesionalesActivosIds = new Set(profesionales.map((p) => p.id));

      this.servicioDeServicios.getAllServices().subscribe((servicios) => {
        this.listaDeServicios = servicios.filter(
          (servicio) =>
            servicio.profesionalId &&
            profesionalesActivosIds.has(servicio.profesionalId)
        );
        this.listaDeServiciosOriginal = [...this.listaDeServicios];
        console.log(
          'Servicios cargados (filtrados por profesional):',
          this.listaDeServicios.map((s) => s.id)
        );
      });
    });
  }

  trackByServicio(index: number, servicio: ServicioMedico): string {
    return `${servicio.id}-${index}`;
  }

  buscar(searchInput: HTMLInputElement) {
    const termino = searchInput.value.trim().toLowerCase();
    if (termino) {
      this.listaDeServicios = this.listaDeServiciosOriginal.filter(
        (servicio) =>
          servicio.nombre.toLowerCase().includes(termino) ||
          servicio.descripcion.toLowerCase().includes(termino)
      );
    } else {
      this.listaDeServicios = [...this.listaDeServiciosOriginal];
    }
  }

  agendarCita(servicio: ServicioMedico): void {
  const userId = localStorage.getItem('identificador');

  if (!userId) {
    this.mostrarDialogo('Error', 'Debes iniciar sesión para agendar una cita.');
    return;
  }
  if (!servicio.id) {
    this.mostrarDialogo('Error', 'El servicio seleccionado no tiene un ID válido.');
    return;
  }

  this.servicioCita.verificarCitaExistente(userId, servicio.id).subscribe({
    next: (respuesta) => {
      if (respuesta.existe) {
        this.mostrarDialogo('Error', 'Ya tienes una cita activa agendada para este servicio.');
      } else {
        this.navegador.navigate(['/registro-actualizacion-cita'], {
          queryParams: {
            id: servicio.id,
            nombre: servicio.nombre,
            descripcion: servicio.descripcion,
            fechaDisponible: servicio.fechaDisponible,
            precio: servicio.precio,
            profesionalId: servicio.profesionalId,
          },
        });
      }
    },
    error: (err) => {
      console.error('Error al verificar la cita:', err);
      this.mostrarDialogo('Error', 'Hubo un problema al verificar la cita. Por favor, inténtalo de nuevo.');
    }
  });
}
  mostrarDialogo(title: string, message: string): void {
    this.dialog.open(DialogoComponent, {
      width: '400px',
      data: <DialogData>{
        title: title,
        message: message,
        confirmText: 'Aceptar',
        showCancelButton: false,
      },
    });
  }
}