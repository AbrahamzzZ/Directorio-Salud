import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import { ServicioMedico } from '../../../../models/ServicioMedico';
import { Cita } from '../../../../models/Citas';
import { ServCitaService } from '../../../../services/servicio-cita/serv-cita.service';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle,} from '@angular/material/card';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { ServLoginService } from '../../../../services/serv-login.service';
import { ServServiciosjsonService } from '../../../../services/servicio-servicios/serv-serviciosjson.service';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../../../models/Dialog-data';
import { DialogoComponent } from '../../../shared/dialogo/dialogo.component';
import { ServProfesionalesService } from '../../../../services/servicio-profesional/serv-profesionales.service';
import { Profesional } from '../../../../models/Profesional';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-registro-actualizacion-cita',
  imports: [
    MatCard, MatCardContent, MatCardHeader, MatCardTitle, ReactiveFormsModule, DatePipe, CurrencyPipe, HeaderComponent,
    FooterComponent, CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatRadioModule, MatButtonModule,
    MatCheckboxModule, MatIcon
  ],
  templateUrl: './registro-actualizacion-cita.component.html',
  styleUrls: ['./registro-actualizacion-cita.component.css'],
})
export class RegistroActualizacionCitaComponent implements OnInit {
  formularioCita: FormGroup;
  detallesServicio: ServicioMedico | null = null;
  esEdicion: boolean = false;
  idCitaActual: string | null = null;
  direccionesUnicas: string[] = [];
  prioridadesValidas: string[] = ['Baja', 'Media', 'Alta'];
  profesional: Profesional | null = null;

  constructor(
    private rutaActiva: ActivatedRoute,
    private constructorFormulario: FormBuilder,
    private servicioCita: ServCitaService,
    private enrutador: Router,
    private servicioLogin: ServLoginService,
    private servicioServicios: ServServiciosjsonService,
    private dialog: MatDialog,
    private servicioProfesionales: ServProfesionalesService
  ) {
      this.formularioCita = this.constructorFormulario.group({
    direccion: ['', Validators.required],
    prioridad: ['', [Validators.required, Validators.pattern(new RegExp(`^(${this.prioridadesValidas.join('|')})$`, 'i'))]],
    metodoPago: ['', Validators.required],
    fechaHora: [''],
    estadoCita: ['agendada'],
    esNuevoPaciente: [false],
  });
    }

  ngOnInit(): void {
    this.rutaActiva.paramMap.subscribe((params) => {
      this.idCitaActual = params.get('id');
      this.esEdicion = !!this.idCitaActual;
      if (this.esEdicion) {
        this.cargarCitaParaEdicion(this.idCitaActual!);
      } else {
        this.cargarDireccionesUnicas();
        this.cargarDetallesServicioParaNuevo();
      }
    });
  }

  // Cargar cita por ID para edición
  cargarCitaParaEdicion(citaId: string): void {
    this.servicioCita.getCitaById(citaId).subscribe((cita) => {
      if (!this.direccionesUnicas.includes(cita.direccion)) {
        this.direccionesUnicas = [...this.direccionesUnicas, cita.direccion];
      }
      this.prellenarFormulario(cita);
      this.cargarDetallesServicioPorId(cita.servicioId!);
    });
  }

  // Cargar direcciones únicas de citas existentes
  cargarDireccionesUnicas(): void {
    this.servicioCita.getCitas().subscribe(citas =>
      this.direccionesUnicas = [...new Set(citas.map(c => c.direccion))]
    );
  }

  // Cargar detalles del servicio por ID
  cargarDetallesServicioPorId(servicioId: string): void {
    if (servicioId) {
      this.servicioServicios.getServiceById(servicioId).subscribe((servicio) => {
        this.detallesServicio = servicio;
        this.cargarProfesional(servicio.profesionalId);
      });
    }
  }

  // Cargar detalles del servicio desde parámetros (nuevo registro)
  cargarDetallesServicioParaNuevo(): void {
    this.rutaActiva.queryParams.subscribe((params) => {
      this.detallesServicio = {
        id: params['id'],
        nombre: params['nombre'],
        descripcion: params['descripcion'],
        fechaDisponible: params['fechaDisponible'],
        precio: parseFloat(params['precio']),
        profesionalId: params['profesionalId'],
        requiereChequeo: params['requiereChequeo'] === 'true',
      } as ServicioMedico;
      this.cargarProfesional(params['profesionalId']);
    });
  }

  // Cargar información del profesional
  cargarProfesional(profesionalId: string): void {
    if (profesionalId) {
      this.servicioProfesionales.obtenerprofesionalID(profesionalId).subscribe(
        (profesional) => {
          this.profesional = profesional;
          if (this.esEdicion) {
            this.formularioCita.patchValue({
              direccion: profesional.ubicacion,
            });
          }
          if (!this.esEdicion) {
            this.direccionesUnicas = [profesional.ubicacion];
          }
        },
        (error) => {
          console.error('Error al cargar el profesional:', error);
          this.profesional = null;
        }
      );
    } else {
      this.profesional = null;
    }
  }

  // Prellenar el formulario con datos de cita existente
  prellenarFormulario(cita: Cita): void {
  this.formularioCita.patchValue({
    direccion: cita.direccion,
    prioridad: cita.prioridad,
    metodoPago: cita.metodoPago,
    fechaHora: cita.fechaHora,
    estadoCita: cita.estadoCita, 
  });
}
  // Enviar formulario (crear o actualizar)
  enviarFormulario(): void {
    if (this.formularioCita.valid && this.detallesServicio?.id) {
      if (this.esEdicion && this.idCitaActual) {
        this.confirmarEdicionCita();
      } else {
        this.confirmarRegistroCita();
      }
    } else {
      console.log('El formulario no es válido o no se recibieron los datos del servicio.');
    }
  }
  // Confirmar antes de crear
  confirmarRegistroCita(): void {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      data: <DialogData>{
        title: 'Confirmar Registro',
        message: '¿Estás seguro de que deseas registrar esta cita?',
        confirmText: 'Sí, registrar',
        cancelText: 'Cancelar',
        isConfirmation: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.createCita();
      }
    });
  }

  // Crear la cita
    createCita(): void {
    const userId = this.servicioLogin.getIdentificador();
    const citaData = {
      ...this.formularioCita.value,
      servicioId: this.detallesServicio!.id,
      profesionalId: this.detallesServicio!.profesionalId,
      pacienteId: userId || 'Usuario no registrado',
      fechaHora: this.formularioCita.value.fechaHora || new Date().toISOString(),
      estadoCita: 'agendada', 
    };

    this.servicioCita.createCita(citaData).subscribe(
      () => {
        this.enrutador.navigate(['/mantenimiento-paciente-cita'], { replaceUrl: true });
      },
      (error) => {
        console.error('Error al registrar la cita:', error);
      }
    );
  }
  // Confirmar antes de actualizar
  confirmarEdicionCita(): void {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      data: <DialogData>{
        title: 'Confirmar Edición',
        message: '¿Estás seguro de que deseas guardar los cambios en esta cita?',
        confirmText: 'Sí, guardar',
        cancelText: 'Cancelar',
        isConfirmation: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.updateCita();
      }
    });
  }

  // Actualizar la cita
updateCita(): void {
  const userId = this.servicioLogin.getIdentificador();
  
  this.servicioCita.getCitaById(this.idCitaActual!).subscribe(
    (citaExistente) => {
      const citaData = {
        ...this.formularioCita.value,
        servicioId: this.detallesServicio!.id,
        profesionalId: this.detallesServicio!.profesionalId,
        id: this.idCitaActual!,
        pacienteId: citaExistente.pacienteId || userId,
        fechaHora: this.formularioCita.value.fechaHora || citaExistente.fechaHora
      };

      this.servicioCita.updateCita(citaData).subscribe(
        () => {
          this.enrutador.navigate(['/mantenimiento-paciente-cita'], { replaceUrl: true });
        },
        (error) => {
          console.error('Error al actualizar la cita:', error);
        }
      );
    },
    (error) => {
      console.error('Error al obtener la cita existente:', error);
    }
  );
}
  onCancelar(): void {
    this.enrutador.navigate(['/mantenimiento-paciente-cita']);
  }
}
