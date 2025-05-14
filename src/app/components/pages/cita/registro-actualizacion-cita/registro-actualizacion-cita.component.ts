import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicioMedico } from '../../../../models/ServicioMedico';
import { Cita } from '../../../../models/Citas';
import { ServCitaService } from '../../../../services/servicio-cita/serv-cita.service';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { ServLoginService } from '../../../../services/serv-login.service';
import { ServServiciosjsonService } from '../../../../services/servicio-servicios/serv-serviciosjson.service';
import { ServCitaService } from '../../../../services/servicio-cita/serv-cita.service';

@Component({
  selector: 'app-registro-actualizacion-cita',
  imports: [MatCard, MatCardContent, MatCardHeader, MatCardTitle,
    ReactiveFormsModule, DatePipe, CurrencyPipe, HeaderComponent, FooterComponent, FooterComponent, CommonModule],
  templateUrl: './registro-actualizacion-cita.component.html',
  styleUrls: ['./registro-actualizacion-cita.component.css']
})
export class RegistroActualizacionCitaComponent implements OnInit {
  formularioCita: FormGroup;
  detallesServicio: ServicioMedico | null = null;
  esEdicion: boolean = false;
  idCitaActual: string | null = null;
  direccionesUnicas: string[] = [];

  constructor(
    private rutaActiva: ActivatedRoute,
    private constructorFormulario: FormBuilder,
    private servicioCita: ServCitaService,
    private enrutador: Router,
    private servicioLogin: ServLoginService,
    private servicioServicios: ServServiciosjsonService // Inyecta el servicio de servicios
  ) {
    this.formularioCita = this.constructorFormulario.group({
      direccion: ['', Validators.required],
      prioridad: ['media'],
      metodoPago: ['efectivo', Validators.required],
      fechaHora: [''],
      estado: ['agendada']
    });
  }

  ngOnInit(): void {
    this.rutaActiva.paramMap.subscribe(params => {
      this.idCitaActual = params.get('id');
      this.esEdicion = !!this.idCitaActual; // Si hay ID, estamos en edición
      if (this.esEdicion) {
        this.cargarCitaParaEdicion(this.idCitaActual!);
      } else {
        this.cargarDireccionesUnicas();
        this.cargarDetallesServicioParaNuevo(); // Cargar detalles si no es edición
      }
    });
  }

  cargarCitaParaEdicion(citaId: string): void {
    this.servicioCita.getCitaById(citaId).subscribe(cita => {
      // Asegurarse de que la dirección de la cita actual esté en la lista de direcciones únicas
      if (!this.direccionesUnicas.includes(cita.direccion)) {
        this.direccionesUnicas = [...this.direccionesUnicas, cita.direccion];
      }
      this.prellenarFormulario(cita);
      this.cargarDetallesServicioPorId(cita.servicioId!);
    });
  }
    cargarDireccionesUnicas(): void {
    this.servicioCita.getCitas().subscribe(citas => {
      this.direccionesUnicas = [...new Set(citas.map(cita => cita.direccion))];
    });
  }

  cargarDetallesServicioPorId(servicioId: string): void {
    if (servicioId) {
      this.servicioServicios.getServiceById(servicioId).subscribe(servicio => {
        this.detallesServicio = servicio;
      });
    }
  }

  cargarDetallesServicioParaNuevo(): void {
  this.rutaActiva.queryParams.subscribe(params => {
    this.detallesServicio = {
      id: params['id'],
      nombre: params['nombre'],
      descripcion: params['descripcion'],
      fechaDisponible: params['fechaDisponible'],
      precio: parseFloat(params['precio']),
      profesionalId: params['profesionalId'], // ← AGREGAR ESTO
      requiereChequeo: params['requiereChequeo'] === 'true' 
    } as ServicioMedico;
  });
}

  prellenarFormulario(cita: Cita): void {
    this.formularioCita.patchValue({
      direccion: cita.direccion,
      prioridad: cita.prioridad,
      metodoPago: cita.metodoPago,
      fechaHora: cita.fechaHora, // Usamos fechaHora para prellenar
      estado: cita.estado
    });
  }

  enviarFormulario(): void {
      if (this.formularioCita.valid && this.detallesServicio?.id) {
    const userId = this.servicioLogin.getIdentificador();
    
    const citaData = {
      ...this.formularioCita.value,
      servicioId: this.detallesServicio.id,
      profesionalId: this.detallesServicio.profesionalId, // ← AGREGAR ESTO
      usuarioId: userId || 'USUARIO_TEMPORAL_FALLBACK',
      fechaHora: this.formularioCita.value.fechaHora || new Date().toISOString(),
    };

      if (this.esEdicion && this.idCitaActual) {
        this.servicioCita.updateCita({ ...citaData, id: this.idCitaActual }).subscribe(
          () => {
            alert('Cita actualizada con éxito!');
            this.enrutador.navigate(['/mantenimiento-paciente-cita'], { replaceUrl: true });
          },
          error => {
            console.error('Error al actualizar la cita:', error);
          }
        );
      } else {
        this.servicioCita.createCita(citaData).subscribe(
          () => {
            alert('Cita registrada con éxito!');
            this.enrutador.navigate(['/mantenimiento-paciente-cita'], { replaceUrl: true });
          },
          error => {
            console.error('Error al registrar la cita:', error);
          }
        );
      }
    } else {
      console.log('El formulario no es válido o no se recibieron los datos del servicio.');
    }
  }

  onCancelar(): void {
    this.enrutador.navigate(['/mantenimiento-paciente-cita']);
  }
}