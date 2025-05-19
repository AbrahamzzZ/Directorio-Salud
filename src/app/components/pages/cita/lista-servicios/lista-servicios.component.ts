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
import { ServLoginService } from '../../../../services/serv-login.service';

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
    private navegador: Router,
    private servicioCita: ServCitaService,
    private servicioLogin: ServLoginService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cargarServicios();
  }
  trackByServicio(index: number, servicio: ServicioMedico): string {
    // Combina el id del servicio con su índice para garantizar que sea único
    return `${servicio.id}-${index}`;
  }
  cargarServicios(): void {
    this.servicioDeServicios.getAllServices().subscribe((servicios) => {
      this.listaDeServicios = servicios;
      this.listaDeServiciosOriginal = [...servicios];
      console.log(
        'Servicios cargados:',
        this.listaDeServicios.map((s) => s.id)
      );
    });
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
    // Obtenemos el identificador actualizado desde localStorage
    const userId = localStorage.getItem('identificador');
    console.log('ID del Usuario:', userId);

    if (!userId) {
      this.mostrarDialogo(
        'Error',
        'Debes iniciar sesión para agendar una cita.'
      );
      return;
    }

    this.servicioCita.getCitas().subscribe(
      (citas) => {
        const citaExistente = citas.find(
          (cita) => cita.pacienteId === userId && cita.servicioId === servicio.id 
        );

        if (citaExistente) {
          this.mostrarDialogo(
            'Error',
            'Ya tienes una cita agendada para este servicio.'
          );
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
      (error) => {
        console.error('Error al obtener las citas:', error);
        this.mostrarDialogo(
          'Error',
          'Hubo un error al verificar la cita. Por favor, inténtalo de nuevo.'
        );
      }
    );
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
